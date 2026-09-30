import { CloudSun, X } from 'lucide-react';
import { useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockCity, mockWeatherData } from './mocks/weather';
import { lookupMockWeather, type MockWeatherResult } from './services/mockWeatherService';
import type { Unit } from './types/weather';

type ViewState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'empty' }
  | { status: 'error'; query: string }
  | { status: 'success'; result: MockWeatherResult };

interface AppProps {
  loadWeather?: (query: string) => Promise<MockWeatherResult | null>;
}

export default function App({ loadWeather = lookupMockWeather }: AppProps) {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [view, setView] = useState<ViewState>({
    status: 'success',
    result: { city: mockCity, weather: mockWeatherData },
  });
  const latestRequest = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  async function search(query: string) {
    const request = ++latestRequest.current;
    setView({ status: 'loading', query });

    try {
      const result = await loadWeather(query);
      if (request !== latestRequest.current) return;
      setView(result ? { status: 'success', result } : { status: 'empty' });
    } catch {
      if (request === latestRequest.current) setView({ status: 'error', query });
    }
  }

  function clearSelection() {
    latestRequest.current += 1;
    searchInputRef.current?.focus();
    setView({ status: 'idle' });
  }

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <header className="border-b border-white/10 bg-night-800/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-5 sm:px-8">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <CloudSun aria-hidden="true" className="h-9 w-9 shrink-0 text-sun" />
              <div className="min-w-0">
                <h1 className="text-xl font-semibold">Tempo</h1>
                <p className="text-xs text-white/70">Dados de demonstração</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {view.status === 'success' && (
                <button
                  type="button"
                  onClick={clearSelection}
                  aria-label="Limpar seleção"
                  title="Limpar seleção"
                  className="flex h-11 w-11 items-center justify-center rounded border border-white/10 text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              )}
              <UnitToggle unit={unit} onChange={setUnit} />
            </div>
          </div>
          <div className="w-full max-w-xl">
            <SearchBar onSearch={search} inputRef={searchInputRef} />
          </div>
        </div>
      </header>

      <main className="min-w-0">
        {view.status === 'idle' && (
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
            <h2 className="text-xl font-semibold">Nenhuma cidade selecionada</h2>
          </section>
        )}
        {view.status === 'loading' && (
          <div className="mx-auto max-w-5xl py-8">
            <LoadingState />
          </div>
        )}
        {view.status === 'empty' && (
          <div className="mx-auto max-w-5xl py-8">
            <EmptyState />
          </div>
        )}
        {view.status === 'error' && (
          <div className="mx-auto max-w-5xl py-8">
            <ErrorState
              onRetry={() => {
                searchInputRef.current?.focus();
                void search(view.query);
              }}
            />
          </div>
        )}
        {view.status === 'success' && (
          <>
            <p role="status" className="sr-only">
              Previsão para {view.result.city.name} carregada.
            </p>
            <CurrentWeather
              city={view.result.city}
              current={view.result.weather.current}
              unit={unit}
            />
            <ForecastList forecast={view.result.weather.forecast} unit={unit} />
          </>
        )}
      </main>
    </div>
  );
}
