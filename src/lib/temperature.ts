import type { Unit } from '../types/weather';

export function convertTemperature(valueC: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (valueC * 9) / 5 + 32 : valueC;
}

export function unitLabel(unit: Unit): string {
  return unit === 'celsius' ? '°C' : '°F';
}

export function formatTemperature(valueC: number | null, unit: Unit): string {
  if (valueC === null || !Number.isFinite(valueC)) return 'Indisponível';

  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(convertTemperature(valueC, unit));

  return `${formatted} ${unitLabel(unit)}`;
}
