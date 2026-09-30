import { mockCity, mockWeatherData } from '../../../src/mocks/weather';
import { lookupMockWeather } from '../../../src/services/mockWeatherService';

describe('lookupMockWeather', () => {
  it('encontra a cidade do mock independentemente de caixa e acento', async () => {
    await expect(lookupMockWeather('  sao paulo  ')).resolves.toEqual({
      city: mockCity,
      weather: mockWeatherData,
    });
  });

  it('retorna vazio para cidades sem dados locais', async () => {
    await expect(lookupMockWeather('Recife')).resolves.toBeNull();
  });
});
