import { formatDayLabel } from '../../../src/lib/format';

describe('formatDayLabel', () => {
  it('preserva o dia local da previsão sem depender do fuso do navegador', () => {
    expect(formatDayLabel('2026-09-30')).toMatch(/qua.*30.*set/i);
    expect(formatDayLabel('2026-10-01')).toMatch(/qui.*1.*out/i);
  });
});
