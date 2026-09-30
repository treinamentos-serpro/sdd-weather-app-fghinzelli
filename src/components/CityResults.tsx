import { useEffect, useRef } from 'react';
import type { City } from '../types/weather';

interface CityResultsProps {
  cities: City[];
  onSelect: (city: City) => void;
}

export default function CityResults({ cities, onSelect }: CityResultsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section aria-labelledby="city-results-heading" className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <h2
        ref={headingRef}
        id="city-results-heading"
        tabIndex={-1}
        className="text-xl font-semibold focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-accent-400"
      >
        Cidades encontradas
      </h2>
      <p role="status" className="sr-only">
        {cities.length === 1
          ? 'Foi encontrada 1 cidade.'
          : `Foram encontradas ${cities.length} cidades.`}
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {cities.map((city) => (
          <li key={city.id}>
            <button
              type="button"
              aria-label={`Selecionar ${city.name}${city.admin1 && city.admin1 !== city.name ? `, ${city.admin1}` : ''}, ${city.country}`}
              onClick={() => onSelect(city)}
              className="w-full rounded-md border border-white/40 bg-white/5 px-4 py-3 text-left text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            >
              <span className="block font-medium">{city.name}</span>
              <span className="mt-1 block text-sm text-white/80">
                {city.admin1 && city.admin1 !== city.name ? `${city.admin1}, ` : ''}
                {city.country}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
