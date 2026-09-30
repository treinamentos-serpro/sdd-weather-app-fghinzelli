import { formatDayLabel } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const dayLabel = formatDayLabel(day.date);
  const { label, icon: WeatherIcon } = getWeatherCondition(day.weatherCode);
  const precipitation = day.maxPrecipitationProbabilityPercent;
  const rainChance =
    precipitation === null || !Number.isFinite(precipitation)
      ? 'Indisponível'
      : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(precipitation)}%`;

  return (
    <article
      aria-label={`Previsão para ${dayLabel}`}
      className="flex min-h-52 min-w-0 flex-col rounded-md border border-white/10 bg-white/5 p-4 text-white shadow-glass backdrop-blur-md"
    >
      <h3 className="text-sm font-semibold capitalize text-white/90">{dayLabel}</h3>
      <WeatherIcon aria-hidden="true" className="mt-4 h-10 w-10 shrink-0 text-sun" />
      <p className="mt-2 break-words text-sm text-white/80">{label}</p>
      <dl className="mt-auto grid grid-cols-1 gap-y-2 pt-4 text-sm">
        <div className="min-w-0">
          <dt className="text-white/70">Máx.</dt>
          <dd className="break-words font-semibold">
            {formatTemperature(day.maxTemperatureC, unit)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-white/70">Mín.</dt>
          <dd className="break-words font-semibold">
            {formatTemperature(day.minTemperatureC, unit)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-white/70">Chance de chuva</dt>
          <dd className="font-semibold">{rainChance}</dd>
        </div>
      </dl>
    </article>
  );
}
