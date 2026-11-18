import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AyudaAtajos } from './AyudaAtajos';

describe('AyudaAtajos', () => {
  it('abre un modal con las teclas y lo cierra con Escape', async () => {
    const usuario = userEvent.setup();
    render(<AyudaAtajos />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: 'Shortcuts' }));
    const dialogo = screen.getByRole('dialog', { name: 'Shortcuts' });
    const teclas = [...dialogo.querySelectorAll('kbd')].map((k) => k.textContent);
    expect(teclas).toEqual(['Espacio', 'Enter', 'V', 'S', 'N']);

    await usuario.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('se cierra con el boton Cerrar', async () => {
    const usuario = userEvent.setup();
    render(<AyudaAtajos />);
    await usuario.click(screen.getByRole('button', { name: 'Shortcuts' }));
    await usuario.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
