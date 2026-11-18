import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { aReforzar, estadistica, temaDe } from './fixtures';
import { PanelProgreso } from './PanelProgreso';

const grafos = estadistica(temaDe('t1', 'Grafos', 'GR'), 1, 2, 1);
const complejidad = estadistica(temaDe('t2', 'Complejidad', 'CC'), 0, 0, 3);

describe('PanelProgreso', () => {
  it('compone resumen, refuerzo y una barra por tema', () => {
    render(
      <PanelProgreso
        resumen={{ total: 7, si: 1, no: 2, sin: 4, pct: 14 }}
        reforzar={[aReforzar(grafos)]}
        porTema={[grafos, complejidad]}
        alReiniciar={vi.fn()}
      />,
    );
    expect(screen.getByText('14%')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Temas para reforzar' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Por tema' })).toBeInTheDocument();
    expect(
      screen.getByText('2 no sabidas de 3 respondidas, 25% del tema sabido'),
    ).toBeInTheDocument();
    expect(screen.getByText('Sabidas (color del área)')).toBeInTheDocument();
    expect(screen.getByText('No sabidas')).toBeInTheDocument();
    expect(screen.getAllByText('Sin responder').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(
      screen.getByRole('img', { name: '0 sabidas, 0 no sabidas, 3 sin responder' }),
    ).toBeInTheDocument();
  });

  it('muestra el aviso solo si se pasa', () => {
    const props = {
      resumen: { total: 0, si: 0, no: 0, sin: 0, pct: 0 },
      reforzar: [],
      porTema: [],
      alReiniciar: vi.fn(),
    };
    const { rerender } = render(<PanelProgreso {...props} />);
    expect(screen.queryByText('No se guarda')).not.toBeInTheDocument();
    rerender(<PanelProgreso {...props} aviso="No se guarda" />);
    expect(screen.getByText('No se guarda')).toBeInTheDocument();
  });

  it('reiniciar pide doble confirmacion', async () => {
    const alReiniciar = vi.fn();
    render(
      <PanelProgreso
        resumen={{ total: 0, si: 0, no: 0, sin: 0, pct: 0 }}
        reforzar={[]}
        porTema={[]}
        alReiniciar={alReiniciar}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reiniciar progreso' }));
    expect(alReiniciar).not.toHaveBeenCalled();
    await userEvent.click(within(document.body).getByRole('button', { name: /Seguro\?/ }));
    expect(alReiniciar).toHaveBeenCalledTimes(1);
  });
});
