import { useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'results' | 'success' | 'error' | 'empty';

type LastOperation = { type: 'search'; name: string } | { type: 'weather'; city: City };

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  selectedCity: City | null;
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível carregar os dados.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const lastOperationRef = useRef<LastOperation | null>(null);
  const requestIdRef = useRef(0);

  async function selectCity(city: City): Promise<void> {
    const requestId = ++requestIdRef.current;
    lastOperationRef.current = { type: 'weather', city };
    setStatus('loading');
    setSelectedCity(city);
    setData(null);
    setError(null);

    try {
      const weather = await getWeather(city);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setData(weather);
      setStatus('success');
    } catch (requestError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(getErrorMessage(requestError));
      setStatus('error');
    }
  }

  async function search(name: string): Promise<void> {
    const requestId = ++requestIdRef.current;
    lastOperationRef.current = { type: 'search', name };
    setQuery(name);
    setStatus('loading');
    setData(null);
    setCities([]);
    setSelectedCity(null);
    setError(null);

    try {
      const results = await searchCities(name);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCities(results);

      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      setStatus('results');
    } catch (requestError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(getErrorMessage(requestError));
      setStatus('error');
    }
  }

  async function retry(): Promise<void> {
    const operation = lastOperationRef.current;

    if (!operation) {
      return;
    }

    if (operation.type === 'search') {
      await search(operation.name);
      return;
    }

    await selectCity(operation.city);
  }

  return { status, data, cities, selectedCity, error, query, search, selectCity, retry };
}
