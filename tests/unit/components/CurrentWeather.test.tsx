import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import CurrentWeather from '../../../src/components/CurrentWeather';
import UnitToggle from '../../../src/components/UnitToggle';
import { mockCity, mockWeatherData } from '../../../src/mocks/weather';
import type { Unit } from '../../../src/types/weather';

function WeatherWithUnitToggle() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather
        city={mockCity}
        current={{ ...mockWeatherData.current, temperatureC: 0 }}
        unit={unit}
      />
    </>
  );
}

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

  it('converte 0 °C para 32 °F ao alternar a unidade', async () => {
    const user = userEvent.setup();
    render(<WeatherWithUnitToggle />);

    const report = screen.getByRole('region', { name: 'São Paulo, Brasil' });
    expect(within(report).getByText('0,0 °C')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(within(report).getByText('32,0 °F')).toBeInTheDocument();
  });

  it('converte valores não nulos para Fahrenheit sem alterar vento ou precipitação', () => {
    render(<CurrentWeather city={mockCity} current={mockWeatherData.current} unit="fahrenheit" />);

    expect(screen.getByText('74,1 °F')).toBeInTheDocument();
    expect(screen.getByText('75,4 °F')).toBeInTheDocument();
    expect(screen.getByText('11,5 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
  });
});
