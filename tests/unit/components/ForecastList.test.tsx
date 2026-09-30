import { render, screen, within } from '@testing-library/react';
import ForecastList from '../../../src/components/ForecastList';
import { mockWeatherData } from '../../../src/mocks/weather';

describe('ForecastList', () => {
  it('mostra cinco dias na ordem recebida, com condição, máximas, mínimas e chuva', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    const list = screen.getByRole('list');
    expect(list).toHaveClass('grid-cols-2', 'sm:grid-cols-3', 'lg:grid-cols-5');
    const cards = within(list).getAllByRole('article');
    expect(cards).toHaveLength(5);
    expect(within(cards[0]).getByText('Máx.').closest('dl')).toHaveClass('grid-cols-1');
    expect(cards[0]).toHaveAccessibleName('Previsão para Hoje');
    expect(cards[4]).toHaveAccessibleName(/previsão para dom/i);
    expect(within(cards[0]).getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(within(cards[0]).getByText('25,6 °C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('17,2 °C')).toBeInTheDocument();
    expect(within(cards[0]).getByText('10%')).toBeInTheDocument();
  });

  it('converte temperaturas e mantém zero válido e ausências explícitas', () => {
    render(
      <ForecastList
        forecast={[
          {
            date: '2026-09-30',
            weatherCode: null,
            maxTemperatureC: 25.6,
            minTemperatureC: null,
            maxPrecipitationProbabilityPercent: 0,
          },
        ]}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('78,1 °F')).toBeInTheDocument();
    expect(screen.getAllByText('Indisponível')).toHaveLength(2);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('informa quando a previsão está vazia', () => {
    render(<ForecastList forecast={[]} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão indisponível.');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
