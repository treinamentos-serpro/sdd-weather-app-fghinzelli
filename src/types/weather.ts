export type Unit = 'celsius' | 'fahrenheit';

export type NullableNumber = number | null;

export interface City {
  id: string;
  name: string;
  admin1: string | null;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  observedAt: string | null;
  weatherCode: number | null;
  temperatureC: NullableNumber;
  apparentTemperatureC: NullableNumber;
  humidityPercent: NullableNumber;
  windSpeedKmh: NullableNumber;
  precipitationMm?: NullableNumber;
  pressureHpa?: NullableNumber;
}

export interface ForecastDay {
  date: string;
  weatherCode: number | null;
  minTemperatureC: NullableNumber;
  maxTemperatureC: NullableNumber;
  maxPrecipitationProbabilityPercent: NullableNumber;
}

export interface WeatherData {
  timezone: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  completeness: 'complete' | 'partial';
}
