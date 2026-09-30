import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import { type UseWeatherResult, useWeather } from '../../src/hooks/useWeather';
import { mockCity, mockWeatherData } from '../../src/mocks/weather';

vi.mock('../../src/hooks/useWeather', () => ({
  useWeather: vi.fn(),
}));

const actions = {
  search: vi.fn<UseWeatherResult['search']>(),
  selectCity: vi.fn<UseWeatherResult['selectCity']>(),
  retry: vi.fn<UseWeatherResult['retry']>(),
};

function mockWeatherState(overrides: Partial<UseWeatherResult> = {}) {
  vi.mocked(useWeather).mockReturnValue({
    status: 'idle',
    data: null,
    cities: [],
    selectedCity: null,
    error: null,
    query: '',
    ...actions,
    ...overrides,
  });
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWeatherState();
  });

  it('renderiza idle e encaminha a busca ao hook', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade selecionada' })).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo{Enter}');
    expect(actions.search).toHaveBeenCalledWith('São Paulo');
  });

  it('renderiza loading', () => {
    mockWeatherState({ status: 'loading' });
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando dados...');
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
  });

  it('renderiza empty', () => {
    mockWeatherState({ status: 'empty' });
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada.');
  });

  it('renderiza os resultados e seleciona a cidade ativada pelo teclado', async () => {
    const user = userEvent.setup();
    mockWeatherState({ status: 'results', cities: [mockCity] });
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Foi encontrada 1 cidade.');
    const resultsHeading = screen.getByRole('heading', { name: 'Cidades encontradas' });
    expect(resultsHeading).toHaveFocus();
    const cityButton = screen.getByRole('button', { name: 'Selecionar São Paulo, Brasil' });
    await user.tab();
    expect(cityButton).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(actions.selectCity).toHaveBeenCalledWith(mockCity);
  });

  it('renderiza error e chama retry', async () => {
    const user = userEvent.setup();
    mockWeatherState({ status: 'error', error: 'Falha de rede.' });
    render(<App />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(actions.retry).toHaveBeenCalledOnce();
  });

  it('renderiza success e mantém a unidade como estado de UI', async () => {
    const user = userEvent.setup();
    mockWeatherState({ status: 'success', data: mockWeatherData, selectedCity: mockCity });
    render(<App />);

    expect(screen.getByText('23,4 °C')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Previsão para São Paulo carregada.');
    expect(screen.getAllByRole('article')).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));
    expect(screen.getByText('74,1 °F')).toBeInTheDocument();
    expect(mockWeatherData.current.temperatureC).toBe(23.4);
    expect(actions.search).not.toHaveBeenCalled();
  });
});
