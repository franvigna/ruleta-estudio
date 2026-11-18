import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ListaMaterias } from './ListaMaterias';
import type { ItemConAvance } from './TarjetaMateria';

const items: ItemConAvance[] = [
  {
    id: 'pa',
    nombre: 'Programación Avanzada',
    descripcion: 'Complejidad y grafos',
    cantidadTemas: 18,
    cantidadPreguntas: 120,
    pct: 35,
  },
  {
    id: 'demo',
    nombre: 'Materia de ejemplo',
    descripcion: 'Para probar',
    ejemplo: true,
    cantidadTemas: 2,
    cantidadPreguntas: 6,
    pct: 0,
  },
];

function crearRenderEnlace() {
  return vi.fn((id: string, contenido: ReactNode, className?: string) => (
    <a href={`#/materia/${id}`} className={className}>
      {contenido}
    </a>
  ));
}

describe('ListaMaterias', () => {
  it('pinta cada materia con sus datos', () => {
    render(<ListaMaterias items={items} renderEnlace={crearRenderEnlace()} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Programación Avanzada')).toBeInTheDocument();
    expect(screen.getByText('Complejidad y grafos')).toBeInTheDocument();
    expect(screen.getByText('18 temas · 120 preguntas')).toBeInTheDocument();
    expect(screen.getByText('35% sabido')).toBeInTheDocument();
    expect(screen.getByText('0% sabido')).toBeInTheDocument();
  });

  it('solo las materias de ejemplo llevan la insignia', () => {
    render(<ListaMaterias items={items} renderEnlace={crearRenderEnlace()} />);
    expect(screen.getAllByText('Ejemplo')).toHaveLength(1);
    const enlace = screen.getByRole('link', { name: /Materia de ejemplo/ });
    expect(enlace).toHaveTextContent('Ejemplo');
  });

  it('invoca renderEnlace una vez por materia y los enlaces llegan al DOM', () => {
    const renderEnlace = crearRenderEnlace();
    render(<ListaMaterias items={items} renderEnlace={renderEnlace} />);
    expect(renderEnlace).toHaveBeenCalledTimes(2);
    expect(renderEnlace.mock.calls.map((c) => c[0])).toEqual(['pa', 'demo']);
    expect(renderEnlace.mock.calls[0]?.[2]).toEqual(expect.any(String));
    expect(screen.getByRole('link', { name: /Programación Avanzada/ })).toHaveAttribute(
      'href',
      '#/materia/pa',
    );
  });

  it('lista vacia muestra el mensaje', () => {
    const renderEnlace = crearRenderEnlace();
    render(<ListaMaterias items={[]} renderEnlace={renderEnlace} />);
    expect(
      screen.getByText('Todavía no hay materias. Ejecutá npm run content:build.'),
    ).toBeInTheDocument();
    expect(renderEnlace).not.toHaveBeenCalled();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
