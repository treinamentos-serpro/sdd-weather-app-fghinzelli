import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../../src/App';
import { mockCity, mockWeatherData } from '../../src/mocks/weather';

describe('App com dados de demonstração', () => {
  it('mostra relatório mock, alterna unidade sem alterar dados e permite voltar ao idle', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('23,4 °C')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Previsão para São Paulo carregada.');
    expect(screen.getAllByRole('article')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    expect(screen.getByText('74,1 °F')).toBeInTheDocument();
    expect(mockWeatherData.current.temperatureC).toBe(23.4);
    await user.click(screen.getByRole('button', { name: 'Limpar seleção' }));
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveFocus();
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeInTheDocument();
    expect(screen.queryByText('74,1 °F')).not.toBeInTheDocument();
  });

  it('apresenta loading e vazio, depois encontra a cidade no mock', async () => {
    const user = userEvent.setup();
    let resolveWeather: (
      value: { city: typeof mockCity; weather: typeof mockWeatherData } | null,
    ) => void = () => {};
    const loadWeather = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<{ city: typeof mockCity; weather: typeof mockWeatherData } | null>(
            (resolve) => {
              resolveWeather = resolve;
            },
          ),
      )
      .mockResolvedValue({ city: mockCity, weather: mockWeatherData });
    render(<App loadWeather={loadWeather} />);

    const input = screen.getByRole('searchbox', { name: 'Cidade' });
    await user.type(input, 'Cidade desconhecida{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Carregando dados...');
    expect(input).toHaveFocus();
    expect(input).toBeEnabled();
    expect(screen.queryByText('23,4 °C')).not.toBeInTheDocument();
    resolveWeather(null);
    expect(await screen.findByText('Nenhuma cidade encontrada.')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'Sao Paulo{Enter}');
    expect(await screen.findByText('23,4 °C')).toBeInTheDocument();
    expect(loadWeather).toHaveBeenLastCalledWith('Sao Paulo');
  });

  it('anuncia falha e só repete a consulta após clicar em tentar novamente', async () => {
    const user = userEvent.setup();
    const loadWeather = vi
      .fn()
      .mockRejectedValueOnce(new Error('Sem rede'))
      .mockResolvedValue({ city: mockCity, weather: mockWeatherData });
    render(<App loadWeather={loadWeather} />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os dados.',
    );
    expect(loadWeather).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toHaveFocus();
    expect(await screen.findByText('23,4 °C')).toBeInTheDocument();
    expect(loadWeather).toHaveBeenCalledTimes(2);
    expect(loadWeather).toHaveBeenLastCalledWith('São Paulo');
  });

  it('ignora resposta antiga se uma nova busca for enviada durante o carregamento', async () => {
    const user = userEvent.setup();
    const requests: Array<
      (value: { city: typeof mockCity; weather: typeof mockWeatherData } | null) => void
    > = [];
    const loadWeather = vi.fn(
      () =>
        new Promise<{ city: typeof mockCity; weather: typeof mockWeatherData } | null>(
          (resolve) => {
            requests.push(resolve);
          },
        ),
    );
    render(<App loadWeather={loadWeather} />);

    const input = screen.getByRole('searchbox', { name: 'Cidade' });
    await user.type(input, 'Recife{Enter}');
    await user.clear(input);
    await user.type(input, 'São Paulo{Enter}');
    await act(async () => {
      requests[1]({ city: mockCity, weather: mockWeatherData });
    });
    expect(screen.getByRole('status')).toHaveTextContent('Previsão para São Paulo carregada.');
    await act(async () => {
      requests[0](null);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Previsão para São Paulo carregada.');
    expect(screen.queryByText('Nenhuma cidade encontrada.')).not.toBeInTheDocument();
  });
});
