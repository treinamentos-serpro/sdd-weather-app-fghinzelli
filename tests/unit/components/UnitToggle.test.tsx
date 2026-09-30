import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import UnitToggle from '../../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('expõe o grupo e a seleção controlada pela prop', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    const celsius = screen.getByRole('button', { name: 'Celsius', pressed: true });
    const fahrenheit = screen.getByRole('button', { name: 'Fahrenheit', pressed: false });
    expect(celsius).toHaveTextContent('°C');
    expect(fahrenheit).toHaveTextContent('°F');

    await user.click(fahrenheit);
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    expect(fahrenheit).toHaveAttribute('aria-pressed', 'true');
    expect(celsius).toHaveAttribute('aria-pressed', 'false');
  });

  it('permite navegar com Tab e setas e ativar com Enter/Espaço', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<UnitToggle unit="celsius" onChange={onChange} />);
    const celsius = screen.getByRole('button', { name: 'Celsius' });
    const fahrenheit = screen.getByRole('button', { name: 'Fahrenheit' });

    await user.tab();
    expect(celsius).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(fahrenheit).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);
    await user.keyboard('{ArrowLeft}');
    expect(celsius).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('celsius');

    await user.tab();
    expect(fahrenheit).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');
  });
});
