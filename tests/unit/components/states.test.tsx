import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import EmptyState from '../../../src/components/states/EmptyState';
import ErrorState from '../../../src/components/states/ErrorState';
import LoadingState from '../../../src/components/states/LoadingState';

describe('estados da interface', () => {
  it('anuncia o carregamento pelo status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando dados...');
  });

  it('anuncia o erro e só tenta novamente após a ação do usuário', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar os dados. Tente novamente.',
    );
    expect(onRetry).not.toHaveBeenCalled();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('mostra título e dica no estado vazio', () => {
    render(<EmptyState />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada.');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada.' })).toBeInTheDocument();
    expect(screen.getByText('Tente buscar por outra cidade.')).toBeInTheDocument();
  });

  it('aceita mensagens específicas para cada fluxo', () => {
    render(
      <>
        <LoadingState message="Buscando cidades..." />
        <ErrorState message="Busca indisponível." onRetry={vi.fn()} />
        <EmptyState title="Sem previsão." hint="Selecione outra cidade." />
      </>,
    );

    expect(screen.getByText('Buscando cidades...')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Busca indisponível.');
    expect(screen.getByRole('heading', { name: 'Sem previsão.' })).toBeInTheDocument();
    expect(screen.getByText('Selecione outra cidade.')).toBeInTheDocument();
  });
});
