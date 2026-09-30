export function formatDayLabel(isoDate: string, dayIndex?: number): string {
  if (dayIndex === 0) return 'Hoje';
  if (dayIndex === 1) return 'Amanhã';

  const date = new Date(`${isoDate}T00:00:00Z`);

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}

export function getShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date);
}
