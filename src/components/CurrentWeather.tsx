import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null | undefined, suffix: string): string {
  if (value == null || !Number.isFinite(value)) return 'Indisponível';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const { label, icon: WeatherIcon } = getWeatherCondition(current.weatherCode);
  const temperature = formatTemperature(current.temperatureC, unit);
  const metrics = [
    { label: 'Sensação térmica', value: formatTemperature(current.apparentTemperatureC, unit) },
    { label: 'Umidade', value: formatMetric(current.humidityPercent, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 'hPa') },
  ];

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="min-w-0 border-y border-white/10 bg-white/5 px-4 py-8 text-white backdrop-blur-md sm:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <h2 id="current-weather-heading" className="break-words text-xl font-semibold sm:text-2xl">
          {city.name}
          {city.admin1 && city.admin1 !== city.name ? `, ${city.admin1}` : ''}, {city.country}
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-5 sm:gap-8">
          <WeatherIcon aria-hidden="true" className="h-14 w-14 shrink-0 text-sun sm:h-20 sm:w-20" />
          <div className="min-w-0">
            <p
              className={`break-words font-semibold leading-none ${temperature === 'Indisponível' ? 'text-2xl' : 'text-6xl sm:text-8xl'}`}
            >
              {temperature}
            </p>
            <p className="mt-3 text-lg text-white/80">{label}</p>
          </div>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-5 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <dt className="text-sm text-white/70">{metric.label}</dt>
              <dd className="mt-1 break-words text-base font-medium">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
