import { CloudSun } from 'lucide-react';
import { useState } from 'react';
import CityResults from './components/CityResults';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, cities, selectedCity, error, search, selectCity, retry } = useWeather();

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <header className="border-b border-white/10 bg-night-800/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5 sm:px-8">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <CloudSun aria-hidden="true" className="h-9 w-9 shrink-0 text-sun" />
              <div className="min-w-0">
                <h1 className="text-xl font-semibold">Tempo</h1>
                <p className="text-xs text-white/70">Dados da Open-Meteo</p>
              </div>
            </div>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
          <div className="w-full max-w-xl">
            <SearchBar onSearch={(name) => void search(name)} />
          </div>
        </div>
      </header>

      {status === 'loading' && (
        <div className="mx-auto max-w-5xl py-8">
          <LoadingState />
        </div>
      )}

      <main aria-busy={status === 'loading'} className="min-w-0">
        {status === 'idle' && (
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
            <h2 className="text-xl font-semibold">Nenhuma cidade selecionada</h2>
          </section>
        )}
        {status === 'empty' && (
          <div className="mx-auto max-w-5xl py-8">
            <EmptyState />
          </div>
        )}
        {status === 'results' && (
          <CityResults cities={cities} onSelect={(city) => void selectCity(city)} />
        )}
        {status === 'error' && (
          <div className="mx-auto max-w-5xl py-8">
            <ErrorState message={error ?? undefined} onRetry={() => void retry()} />
          </div>
        )}
        {status === 'success' && data && selectedCity && (
          <>
            <p role="status" className="sr-only">
              Previsão para {selectedCity.name} carregada.
            </p>
            <CurrentWeather city={selectedCity} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
