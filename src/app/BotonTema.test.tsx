import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BotonTema } from './BotonTema';

describe('BotonTema', () => {
  it('alterna entre los temas claro y oscuro', async () => {
    const usuario = userEvent.setup();
    render(<BotonTema />);

    const botonOscuro = screen.getByRole('button', { name: 'Activar tema oscuro' });
    expect(document.documentElement).toHaveAttribute('data-tema', 'claro');
    expect(botonOscuro).toHaveAttribute('aria-pressed', 'false');

    await usuario.click(botonOscuro);

    const botonClaro = screen.getByRole('button', { name: 'Activar tema claro' });
    expect(document.documentElement).toHaveAttribute('data-tema', 'oscuro');
    expect(botonClaro).toHaveAttribute('aria-pressed', 'true');
  });
});
