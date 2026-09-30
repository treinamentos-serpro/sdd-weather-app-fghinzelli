import {
  fetchWithTimeout,
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

const city: City = {
  id: '3448433',
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.5505,
  longitude: -46.6333,
};

describe('fetchWithTimeout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('aborta após 10 segundos e converte AbortError', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Abortada', 'AbortError'));
        });
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const request = fetchWithTimeout('https://example.com');
    const expectation = expect(request).rejects.toEqual(
      expect.objectContaining({
        name: 'WeatherServiceError',
        message: 'A requisição demorou demais.',
      }),
    );
    await vi.advanceTimersByTimeAsync(10_000);

    await expectation;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('converte falhas de rede e limpa o timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockRejectedValue(new TypeError('Failed to fetch')),
    );

    await expect(fetchWithTimeout('https://example.com')).rejects.toEqual(
      expect.objectContaining({
        name: 'WeatherServiceError',
        message: 'Falha de rede.',
      }),
    );
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('searchCities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('retorna vazio sem chamar a rede para uma consulta vazia', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('codifica a consulta e mapeia os resultados para City', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 3448433,
              name: 'São Paulo',
              admin1: 'São Paulo',
              country: 'Brasil',
              latitude: -23.5505,
              longitude: -46.6333,
            },
            {
              id: 6322752,
              name: 'São Paulo',
              country: 'Brasil',
              latitude: -26.4822,
              longitude: -49.0735,
            },
          ],
        }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('  São Paulo  ')).resolves.toEqual([
      {
        id: '3448433',
        name: 'São Paulo',
        admin1: 'São Paulo',
        country: 'Brasil',
        latitude: -23.5505,
        longitude: -46.6333,
      },
      {
        id: '6322752',
        name: 'São Paulo',
        admin1: null,
        country: 'Brasil',
        latitude: -26.4822,
        longitude: -49.0735,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=10&language=pt&format=json',
      { signal: expect.any(AbortSignal) },
    );
  });

  it('retorna vazio quando results está ausente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({}))),
    );

    await expect(searchCities('Recife')).resolves.toEqual([]);
  });

  it('lança WeatherServiceError quando a resposta não é ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 })),
    );

    const request = searchCities('Recife');

    await expect(request).rejects.toBeInstanceOf(WeatherServiceError);
    await expect(request).rejects.toMatchObject({ status: 503 });
  });
});

describe('getWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('mapeia o clima atual e cinco dias de previsão', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          timezone: 'America/Sao_Paulo',
          current: {
            time: '2026-09-30T14:00',
            temperature_2m: 23.4,
            apparent_temperature: 24.1,
            relative_humidity_2m: 62,
            weather_code: 2,
            wind_speed_10m: 11.5,
          },
          daily: {
            time: ['2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
            weather_code: [2, 3, 61, 80, 1],
            temperature_2m_min: [17.2, 18.1, 19.4, 18.7, 16.9],
            temperature_2m_max: [25.6, 26.3, 23.8, 24.2, 27.1],
            precipitation_probability_max: [null, 20, 70, 55, 5],
          },
        }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const weather = await getWeather(city);

    expect(weather.current).toEqual({
      observedAt: '2026-09-30T14:00',
      weatherCode: 2,
      temperatureC: 23.4,
      apparentTemperatureC: 24.1,
      humidityPercent: 62,
      windSpeedKmh: 11.5,
    });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[2]).toEqual({
      date: '2026-10-02',
      weatherCode: 61,
      minTemperatureC: 19.4,
      maxTemperatureC: 23.8,
      maxPrecipitationProbabilityPercent: 70,
    });
    expect(weather.forecast[0]?.maxPrecipitationProbabilityPercent).toBe(0);

    const requestedUrl = fetchMock.mock.calls[0]?.[0];
    expect(requestedUrl).toBeInstanceOf(URL);
    const searchParams = (requestedUrl as URL).searchParams;
    expect(searchParams.get('latitude')).toBe('-23.5505');
    expect(searchParams.get('longitude')).toBe('-46.6333');
    expect(searchParams.get('current')).toContain('temperature_2m');
    expect(searchParams.get('daily')).toContain('temperature_2m_max');
    expect(searchParams.get('forecast_days')).toBe('5');
  });

  it.each([
    { current: undefined, daily: {} },
    { current: {}, daily: undefined },
  ])('lança WeatherServiceError para resposta incompleta', async (body) => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body))),
    );

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
