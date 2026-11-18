import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aReforzar, estadistica, temaDe } from './fixtures';
import { TemasAReforzar } from './TemasAReforzar';

describe('TemasAReforzar', () => {
  it('lista cada tema con su detalle', () => {
    const a = aReforzar(estadistica(temaDe('t1', 'Grafos', 'GR'), 1, 3, 2));
    const b = aReforzar(estadistica(temaDe('t2', 'Complejidad', 'CC'), 2, 1, 0));
    render(<TemasAReforzar temas={[a, b]} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Grafos');
    expect(items[0]).toHaveTextContent('3 no sabidas de 4 respondidas, 17% del tema sabido');
    expect(items[1]).toHaveTextContent('1 no sabidas de 3 respondidas, 67% del tema sabido');
  });

  it('sin temas muestra el texto vacio', () => {
    render(<TemasAReforzar temas={[]} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Todavía no marcaste ninguna pregunta como no sabida. Cuando lo hagas, acá aparecen los temas con más errores.',
      ),
    ).toBeInTheDocument();
  });
});
