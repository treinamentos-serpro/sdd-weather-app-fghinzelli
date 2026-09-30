import type { Unit } from '../types/weather';

export function formatTemperature(valueC: number | null, unit: Unit): string {
  if (valueC === null || !Number.isFinite(valueC)) return 'Indisponível';

  const value = unit === 'fahrenheit' ? (valueC * 9) / 5 + 32 : valueC;
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

  return `${formatted} °${unit === 'celsius' ? 'C' : 'F'}`;
}
