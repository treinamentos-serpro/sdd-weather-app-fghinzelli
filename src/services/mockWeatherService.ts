import { mockCity, mockWeatherData } from '../mocks/weather';
import type { City, WeatherData } from '../types/weather';

export interface MockWeatherResult {
  city: City;
  weather: WeatherData;
}

export function lookupMockWeather(query: string): Promise<MockWeatherResult | null> {
  const matches =
    new Intl.Collator('pt-BR', { sensitivity: 'base' }).compare(query.trim(), mockCity.name) === 0;

  return new Promise((resolve) => {
    setTimeout(() => resolve(matches ? { city: mockCity, weather: mockWeatherData } : null), 350);
  });
}
