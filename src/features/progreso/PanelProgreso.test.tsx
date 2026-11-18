import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Pregunta, Progreso, Tema } from '../../domain/types';
import { estadistica } from './fixtures';
import { PanelProgreso, type PanelProgresoProps } from './PanelProgreso';

const preguntaBfs: Pregunta = {
  id: 'p1',
  tipo: 'teorica',
  enunciado: '<p>¿Qué es BFS?</p>',
  respuesta: '<p>Un recorrido por niveles.</p>',
};
const preguntaDfs: Pregunta = {
  id: 'p2',
  tipo: 'teorica',
  enunciado: '<p>¿Qué es DFS?</p>',
  respuesta: '<p>Un recorrido en profundidad.</p>',
};
const preguntaBigO: Pregunta = {
  id: 'p3',
  tipo: 'teorica',
  enunciado: '<p>¿Qué es Big O?</p>',
  respuesta: '<p>Una cota asintótica.</p>',
};

function tema(id: string, nombre: string, area: string, preguntas: readonly Pregunta[]): Tema {
  return { id, nombre, etiquetaCorta: nombre.slice(0, 4), area, preguntas };
}

const grafos = estadistica(tema('t1', 'Grafos', 'GR', [preguntaBfs, preguntaDfs]), 1, 1, 0);
const complejidad = estadistica(tema('t2', 'Complejidad', 'CC', [preguntaBigO]), 0, 0, 1);
const progreso: Progreso = {
  marcas: { p1: 'si', p2: 'no' },
  fallos: { p2: 3 },
};

function props(parcial: Partial<PanelProgresoProps> = {}): PanelProgresoProps {
  return {
    resumen: { total: 3, si: 1, no: 1, sin: 1, pct: 33 },
    porTema: [grafos, complejidad],
    progreso,
    alReiniciar: vi.fn(),
    ...parcial,
  };
}

describe('PanelProgreso', () => {
  it('muestra el catalogo por tema y permite desplegar las respuestas', async () => {
    render(<PanelProgreso {...props()} />);

    expect(screen.getByText('33%')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Por tema' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Temas para reforzar' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    const detalleGrafos = screen.getByText('Grafos').closest('details');
    expect(detalleGrafos).not.toBeNull();
    await userEvent.click(screen.getByText('Grafos'));
    expect(detalleGrafos).toHaveAttribute('open');

    const detallePregunta = screen.getByText('¿Qué es BFS?').closest('details');
    expect(detallePregunta).not.toBeNull();
    await userEvent.click(screen.getByText('¿Qué es BFS?'));
    expect(detallePregunta).toHaveAttribute('open');
    expect(screen.getByText('Un recorrido por niveles.')).toBeInTheDocument();
    expect(screen.getByText('Sabida')).toBeInTheDocument();
    expect(screen.getByText('No sabida')).toBeInTheDocument();
    expect(screen.getAllByText('Sin responder').length).toBeGreaterThan(0);
  });

  it('filtra por preguntas con fallos y las ordena dentro de cada unidad', async () => {
    render(<PanelProgreso {...props()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Temas para reforzar' }));

    expect(screen.getByRole('button', { name: 'Temas para reforzar' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Grafos')).toBeInTheDocument();
    expect(screen.queryByText('Complejidad')).not.toBeInTheDocument();
    expect(screen.getByText('¿Qué es DFS?')).toBeInTheDocument();
    expect(screen.queryByText('¿Qué es BFS?')).not.toBeInTheDocument();
    expect(screen.getByText('3 fallos')).toBeInTheDocument();
  });

  it('muestra el vacio del filtro de refuerzo', async () => {
    render(<PanelProgreso {...props({ progreso: { marcas: {} } })} />);
    await userEvent.click(screen.getByRole('button', { name: 'Temas para reforzar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Todavía no hay preguntas para reforzar');
  });

  it('muestra el aviso solo si se pasa', () => {
    const { rerender } = render(<PanelProgreso {...props({ porTema: [] })} />);
    expect(screen.queryByText('No se guarda')).not.toBeInTheDocument();
    rerender(<PanelProgreso {...props({ porTema: [], aviso: 'No se guarda' })} />);
    expect(screen.getByText('No se guarda')).toBeInTheDocument();
  });

  it('reiniciar pide doble confirmacion', async () => {
    const alReiniciar = vi.fn();
    render(<PanelProgreso {...props({ alReiniciar })} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reiniciar progreso' }));
    expect(alReiniciar).not.toHaveBeenCalled();
    await userEvent.click(within(document.body).getByRole('button', { name: /Seguro\?/ }));
    expect(alReiniciar).toHaveBeenCalledTimes(1);
  });
});
