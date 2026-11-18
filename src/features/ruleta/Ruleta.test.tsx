import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { etiquetaSegmento, type PlanGiro } from '../../domain/ruleta-math';
import type { Animador } from './animador';
import { Ruleta, type RuletaProps } from './Ruleta';

const animadorInerte: Animador = {
  ahora: () => 0,
  pedirCuadro: () => 1,
  cancelarCuadro: () => undefined,
};

const temas = [
  { id: 'a', etiquetaCorta: 'Alfa', area: 'X' },
  { id: 'b', etiquetaCorta: 'Beta', area: 'X' },
  { id: 'c', etiquetaCorta: 'Gamma', area: 'Y' },
  { id: 'd', etiquetaCorta: 'Delta', area: 'Y' },
];

function props(extra: Partial<RuletaProps> = {}): RuletaProps {
  return {
    temas,
    disponibles: new Set(temas.map((t) => t.id)),
    rot: 0,
    giro: null,
    ganador: null,
    animador: animadorInerte,
    alGirar: vi.fn(),
    alTic: vi.fn(),
    alTerminar: vi.fn(),
    etiquetaAria: 'Ruleta de prueba',
    ...extra,
  };
}

const segmentos = (c: HTMLElement) => [...c.querySelectorAll<SVGGElement>('g[data-indice]')];
const tieneClase = (el: Element, nombre: string) =>
  [...el.classList].some((c) => c.includes(nombre));

describe('Ruleta', () => {
  it('dibuja un segmento por tema con su etiqueta y el aria-label', () => {
    const { container } = render(<Ruleta {...props()} />);
    expect(screen.getByRole('img', { name: 'Ruleta de prueba' })).toBeInTheDocument();
    expect(segmentos(container)).toHaveLength(4);
    expect(container.querySelectorAll('svg[role="img"] path')).toHaveLength(4);
    for (const t of temas) expect(screen.getByText(t.etiquetaCorta)).toBeInTheDocument();
  });

  it('coloca las etiquetas con transform y anchor correctos a ambos lados de 180 grados', () => {
    const { container } = render(<Ruleta {...props()} />);
    const textos = segmentos(container).map((g) => g.querySelector('text')!);
    // n=4: centros 45, 135 (< 180) y 225, 315 (>= 180)
    for (const [i, texto] of textos.entries()) {
      const et = etiquetaSegmento(i, 4);
      expect(texto).toHaveAttribute('transform', et.transform);
      expect(texto).toHaveAttribute('x', String(et.x));
      expect(texto).toHaveAttribute('y', '204');
      expect(texto).toHaveAttribute('text-anchor', et.anchor);
    }
    expect(textos[0]).toHaveAttribute('text-anchor', 'end');
    expect(textos[1]).toHaveAttribute('text-anchor', 'end');
    expect(textos[2]).toHaveAttribute('text-anchor', 'start');
    expect(textos[3]).toHaveAttribute('text-anchor', 'start');
  });

  it('pinta cada segmento con la variable CSS de su area (base y suave alternados)', () => {
    const { container } = render(<Ruleta {...props()} />);
    const fills = segmentos(container).map((g) => g.querySelector('path')!.style.fill);
    expect(fills).toEqual(['var(--area-X)', 'var(--area-X-2)', 'var(--area-Y)', 'var(--area-Y-2)']);
  });

  it('marca como completo solo a los temas no disponibles', () => {
    const { container } = render(<Ruleta {...props({ disponibles: new Set(['a', 'd']) })} />);
    const completos = segmentos(container).map((g) => tieneClase(g, 'completo'));
    expect(completos).toEqual([false, true, true, false]);
  });

  it('marca al ganador con gana y lo renderiza ultimo, sin mutar los temas', () => {
    const copia = structuredClone(temas);
    const { container } = render(<Ruleta {...props({ ganador: 1 })} />);
    const segs = segmentos(container);
    expect(segs.map((g) => g.dataset.indice)).toEqual(['0', '2', '3', '1']);
    expect(segs.map((g) => tieneClase(g, 'gana'))).toEqual([false, false, false, true]);
    expect(temas).toEqual(copia);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('sin ganador conserva el orden y no marca gana', () => {
    const { container } = render(<Ruleta {...props()} />);
    expect(segmentos(container).map((g) => g.dataset.indice)).toEqual(['0', '1', '2', '3']);
    expect(segmentos(container).some((g) => tieneClase(g, 'gana'))).toBe(false);
  });

  it('aplica la rotacion acumulada y la conserva tras re-renderizar', () => {
    const { container, rerender } = render(<Ruleta {...props({ rot: 123.5 })} />);
    const grupo = () => container.querySelector('svg[role="img"] > g')!;
    expect(grupo()).toHaveAttribute('transform', 'rotate(123.5 200 200)');
    rerender(<Ruleta {...props({ rot: 123.5, ganador: 2 })} />);
    expect(grupo()).toHaveAttribute('transform', 'rotate(123.5 200 200)');
    rerender(<Ruleta {...props({ rot: 900 })} />);
    expect(grupo()).toHaveAttribute('transform', 'rotate(900 200 200)');
  });

  it('click, Enter y Espacio en el centro llaman alGirar', () => {
    const alGirar = vi.fn();
    render(<Ruleta {...props({ alGirar })} />);
    const centro = screen.getByRole('button', { name: 'Girar la ruleta' });
    fireEvent.click(centro);
    expect(alGirar).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(centro, { key: 'Enter' });
    fireEvent.keyDown(centro, { key: ' ' });
    expect(alGirar).toHaveBeenCalledTimes(3);
    fireEvent.keyDown(centro, { key: 'a' });
    expect(alGirar).toHaveBeenCalledTimes(3);
  });

  it('el teclado en el centro hace preventDefault y no burbujea', () => {
    const alDocumento = vi.fn();
    document.addEventListener('keydown', alDocumento);
    render(<Ruleta {...props()} />);
    const centro = screen.getByRole('button', { name: 'Girar la ruleta' });
    const evento = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    centro.dispatchEvent(evento);
    expect(evento.defaultPrevented).toBe(true);
    expect(alDocumento).not.toHaveBeenCalled();
    document.removeEventListener('keydown', alDocumento);
  });

  it('con un giro en curso pide un cuadro al animador', () => {
    const pedirCuadro = vi.fn(() => 7);
    const plan: PlanGiro = { indice: 0, desde: 0, delta: 720, duracionMs: 1000, conTic: true };
    render(<Ruleta {...props({ giro: plan, animador: { ...animadorInerte, pedirCuadro } })} />);
    expect(pedirCuadro).toHaveBeenCalledTimes(1);
  });
});
