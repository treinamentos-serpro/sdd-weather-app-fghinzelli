import type { City, WeatherData } from '../types/weather';

export const mockCity: City = {
  id: '3448439',
  name: 'São Paulo',
  admin1: 'São Paulo',
  country: 'Brasil',
  latitude: -23.5505,
  longitude: -46.6333,
};

export const mockWeatherData: WeatherData = {
  timezone: 'America/Sao_Paulo',
  current: {
    observedAt: '2026-09-30T14:00',
    weatherCode: 2,
    temperatureC: 23.4,
    apparentTemperatureC: 24.1,
    humidityPercent: 62,
    windSpeedKmh: 11.5,
    precipitationMm: 0,
    pressureHpa: 1014,
  },
  forecast: [
    {
      date: '2026-09-30',
      weatherCode: 2,
      minTemperatureC: 17.2,
      maxTemperatureC: 25.6,
      maxPrecipitationProbabilityPercent: 10,
    },
    {
      date: '2026-10-01',
      weatherCode: 3,
      minTemperatureC: 18.1,
      maxTemperatureC: 26.3,
      maxPrecipitationProbabilityPercent: 20,
    },
    {
      date: '2026-10-02',
      weatherCode: 61,
      minTemperatureC: 19.4,
      maxTemperatureC: 23.8,
      maxPrecipitationProbabilityPercent: 70,
    },
    {
      date: '2026-10-03',
      weatherCode: 80,
      minTemperatureC: 18.7,
      maxTemperatureC: 24.2,
      maxPrecipitationProbabilityPercent: 55,
    },
    {
      date: '2026-10-04',
      weatherCode: 1,
      minTemperatureC: 16.9,
      maxTemperatureC: 27.1,
      maxPrecipitationProbabilityPercent: 5,
    },
  ],
  completeness: 'complete',
};
