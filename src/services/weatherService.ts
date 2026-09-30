import type { City, NullableNumber, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

interface GeocodingResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: NullableNumber;
    apparent_temperature?: NullableNumber;
    relative_humidity_2m?: NullableNumber;
    weather_code?: NullableNumber;
    wind_speed_10m?: NullableNumber;
  };
  daily?: {
    time?: string[];
    weather_code?: NullableNumber[];
    temperature_2m_max?: NullableNumber[];
    temperature_2m_min?: NullableNumber[];
    precipitation_probability_max?: NullableNumber[];
  };
}

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

export async function fetchWithTimeout(input: RequestInfo | URL): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { signal: controller.signal });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new WeatherServiceError('A requisição demorou demais.');
    }

    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function searchCities(name: string): Promise<City[]> {
  const query = name.trim();

  if (!query) {
    return [];
  }

  const response = await fetchWithTimeout(
    `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=10&language=pt&format=json`,
  );

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar cidades.', response.status);
  }

  const data = (await response.json()) as GeocodingResponse;

  return (data.results ?? []).map((result) => ({
    id: String(result.id),
    name: result.name,
    admin1: result.admin1 ?? null,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('wind_speed_unit', 'kmh');

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar a previsão do tempo.', response.status);
  }

  const data = (await response.json()) as ForecastResponse;

  if (!data.current || !data.daily) {
    throw new WeatherServiceError('Resposta meteorológica incompleta.', response.status);
  }

  const daily = data.daily;
  const forecast = Array.from({ length: 5 }, (_, index) => ({
    date: daily.time?.[index] ?? '',
    weatherCode: daily.weather_code?.[index] ?? null,
    minTemperatureC: daily.temperature_2m_min?.[index] ?? null,
    maxTemperatureC: daily.temperature_2m_max?.[index] ?? null,
    maxPrecipitationProbabilityPercent: daily.precipitation_probability_max?.[index] ?? null,
  }));

  return {
    timezone: data.timezone ?? 'UTC',
    current: {
      observedAt: data.current.time ?? null,
      weatherCode: data.current.weather_code ?? null,
      temperatureC: data.current.temperature_2m ?? null,
      apparentTemperatureC: data.current.apparent_temperature ?? null,
      humidityPercent: data.current.relative_humidity_2m ?? null,
      windSpeedKmh: data.current.wind_speed_10m ?? null,
    },
    forecast,
    completeness: 'complete',
  };
}
