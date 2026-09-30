import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-heading" className="min-w-0 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 id="forecast-heading" className="text-xl font-semibold text-white sm:text-2xl">
          Previsão para 5 dias
        </h2>
        {forecast.length === 0 ? (
          <p role="status" className="mt-4 text-white/80">
            Previsão indisponível.
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {forecast.map((day, dayIndex) => (
              <li key={day.date} className="min-w-0">
                <ForecastCard day={day} unit={unit} dayIndex={dayIndex} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
