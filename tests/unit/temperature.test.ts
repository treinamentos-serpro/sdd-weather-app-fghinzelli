import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it.each([
    [0, 32],
    [100, 212],
    [-40, -40],
  ])('converte %s °C para %s °F', (celsius, fahrenheit) => {
    expect(convertTemperature(celsius, 'fahrenheit')).toBe(fahrenheit);
  });

  it('mantém o valor em Celsius quando essa é a unidade escolhida', () => {
    expect(convertTemperature(23.456, 'celsius')).toBe(23.456);
  });
});

describe('formatTemperature', () => {
  it('arredonda para uma casa decimal e inclui o símbolo da unidade', () => {
    expect(formatTemperature(12.34, 'celsius')).toBe('12,3 °C');
    expect(formatTemperature(20.26, 'fahrenheit')).toBe('68,5 °F');
  });
});

describe('unitLabel', () => {
  it('retorna o símbolo da unidade selecionada', () => {
    expect(unitLabel('celsius')).toBe('°C');
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
