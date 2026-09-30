import { act, renderHook } from '@testing-library/react';
import { useWeather } from '../../../src/hooks/useWeather';
import { mockCity, mockWeatherData } from '../../../src/mocks/weather';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const secondCity: City = {
  ...mockCity,
  id: '6322752',
  name: 'São Paulo do Norte',
  latitude: -26.4822,
  longitude: -49.0735,
};

describe('useWeather', () => {
  beforeEach(() => {
    vi.mocked(getWeather).mockReset();
    vi.mocked(searchCities).mockReset();
  });

  it('começa no estado idle', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current).toMatchObject({
      status: 'idle',
      data: null,
      cities: [],
      error: null,
      query: '',
    });
  });

  it('busca cidades e carrega o clima da primeira', async () => {
    vi.mocked(searchCities).mockResolvedValue([mockCity, secondCity]);
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(searchCities).toHaveBeenCalledWith('São Paulo');
    expect(getWeather).toHaveBeenCalledWith(mockCity);
    expect(result.current).toMatchObject({
      status: 'success',
      data: mockWeatherData,
      cities: [mockCity, secondCity],
      error: null,
      query: 'São Paulo',
    });
  });

  it('fica empty quando a busca não retorna cidades', async () => {
    vi.mocked(searchCities).mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Cidade inexistente');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('carrega o clima da cidade selecionada', async () => {
    vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(secondCity);
    });

    expect(getWeather).toHaveBeenCalledWith(secondCity);
    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe(mockWeatherData);
  });

  it('repete a última operação após uma falha', async () => {
    vi.mocked(searchCities).mockResolvedValue([mockCity]);
    vi.mocked(getWeather)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce(mockWeatherData);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Falha de rede.');

    await act(async () => {
      await result.current.retry();
    });

    expect(searchCities).toHaveBeenCalledTimes(1);
    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
    expect(result.current.error).toBeNull();
  });
});
