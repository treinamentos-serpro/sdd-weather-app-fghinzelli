import { formatDayLabel, getShortDate } from '../../../src/lib/format';

describe('formatDayLabel', () => {
  it('preserva o dia local da previsão sem depender do fuso do navegador', () => {
    expect(formatDayLabel('2026-09-30')).toMatch(/qua.*30.*set/i);
    expect(formatDayLabel('2026-10-01')).toMatch(/qui.*1.*out/i);
  });

  it('usa Hoje e Amanhã para os dois primeiros dias', () => {
    expect(formatDayLabel('2026-09-30', 0)).toBe('Hoje');
    expect(formatDayLabel('2026-10-01', 1)).toBe('Amanhã');
  });

  it('formata os demais dias com o dia da semana', () => {
    expect(formatDayLabel('2026-10-02', 2)).toMatch(/sex/i);
  });
});

describe('getShortDate', () => {
  it('formata dia e mês em pt-BR sem depender do fuso do navegador', () => {
    expect(getShortDate('2026-09-30')).toMatch(/30.*set/i);
  });
});
