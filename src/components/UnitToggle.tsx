import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const celsiusButton = useRef<HTMLButtonElement>(null);
  const fahrenheitButton = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentUnit: Unit) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    const nextUnit = currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    (nextUnit === 'celsius' ? celsiusButton : fahrenheitButton).current?.focus();
    if (unit !== nextUnit) onChange(nextUnit);
  }

  const buttonClass =
    'min-h-11 min-w-14 rounded px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400';

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex max-w-full gap-1 rounded-lg border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
    >
      <button
        ref={celsiusButton}
        type="button"
        aria-label="Celsius"
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        onKeyDown={(event) => handleKeyDown(event, 'celsius')}
        className={`${buttonClass} ${unit === 'celsius' ? 'bg-accent-600 text-white' : 'text-white hover:bg-white/10'}`}
      >
        °C
      </button>
      <button
        ref={fahrenheitButton}
        type="button"
        aria-label="Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        onKeyDown={(event) => handleKeyDown(event, 'fahrenheit')}
        className={`${buttonClass} ${unit === 'fahrenheit' ? 'bg-accent-600 text-white' : 'text-white hover:bg-white/10'}`}
      >
        °F
      </button>
    </div>
  );
}
