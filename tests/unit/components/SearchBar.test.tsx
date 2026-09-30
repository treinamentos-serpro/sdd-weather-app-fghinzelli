import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  it('mostra erro e não envia consultas vazias pelo botão ou Enter', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const search = screen.getByRole('search', { name: 'Buscar cidade' });
    const input = screen.getByRole('searchbox', { name: 'Cidade' });
    expect(search).toContainElement(input);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome de uma cidade.');
    await user.type(input, '   {Enter}');
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('envia a consulta aparada preservando acentos e espaços internos', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox', { name: 'Cidade' });
    await user.type(input, "  São  José-d'Oeste  {Enter}");
    expect(onSearch).toHaveBeenCalledWith("São  José-d'Oeste");

    await user.clear(input);
    await user.type(input, '  Brasília  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).toHaveBeenLastCalledWith('Brasília');
  });

  it('desabilita input e botão quando solicitado', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} disabled />);

    expect(screen.getByRole('searchbox', { name: 'Cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
    expect(onSearch).not.toHaveBeenCalled();
  });
});
