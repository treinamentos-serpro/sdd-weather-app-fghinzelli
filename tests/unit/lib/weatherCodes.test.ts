import { getWeatherCondition } from '../../../src/lib/weatherCodes';

describe('getWeatherCondition', () => {
  it('retorna a condição correspondente a um código conhecido', () => {
    expect(getWeatherCondition(61).label).toBe('Chuva');
  });

  it.each([1000, null])('usa o fallback para o código %s', (code) => {
    expect(getWeatherCondition(code).label).toBe('Indisponível');
  });
});
