import { render, screen, within } from '@testing-library/react';
import CurrentWeather from '../../../src/components/CurrentWeather';
import { mockCity, mockWeatherData } from '../../../src/mocks/weather';

describe('CurrentWeather', () => {
  it('exibe cidade, condição, temperatura e métricas com valores zero válidos', () => {
    render(<CurrentWeather city={mockCity} current={mockWeatherData.current} unit="celsius" />);

    const report = screen.getByRole('region', { name: 'São Paulo, Brasil' });
    expect(within(report).getByText('23,4 °C')).toBeInTheDocument();
    expect(within(report).getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(within(report).getByText('24,1 °C')).toBeInTheDocument();
    expect(within(report).getByText('62 %')).toBeInTheDocument();
    expect(within(report).getByText('11,5 km/h')).toBeInTheDocument();
    expect(within(report).getByText('0 mm')).toBeInTheDocument();
    expect(within(report).getByText('1.014 hPa')).toBeInTheDocument();
  });

  it('converte de Celsius original e sinaliza métricas ausentes', () => {
    render(
      <CurrentWeather
        city={mockCity}
        current={{
          ...mockWeatherData.current,
          weatherCode: null,
          temperatureC: 0,
          apparentTemperatureC: null,
          humidityPercent: null,
          windSpeedKmh: 0,
          precipitationMm: null,
          pressureHpa: undefined,
        }}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('32,0 °F')).toBeInTheDocument();
    expect(screen.getByText('0 km/h')).toBeInTheDocument();
    expect(screen.getAllByText('Indisponível')).toHaveLength(5);
  });

  it('converte valores não nulos para Fahrenheit sem alterar vento ou precipitação', () => {
    render(<CurrentWeather city={mockCity} current={mockWeatherData.current} unit="fahrenheit" />);

    expect(screen.getByText('74,1 °F')).toBeInTheDocument();
    expect(screen.getByText('75,4 °F')).toBeInTheDocument();
    expect(screen.getByText('11,5 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
  });
});
