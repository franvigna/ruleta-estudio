import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PlanGiro } from '../../domain/ruleta-math';
import type { Animador } from './animador';
import { useGiro } from './useGiro';

/** Animador falso: cola de callbacks y reloj manual. */
function crearAnimadorFalso() {
  let reloj = 1000;
  let siguiente = 1;
  const cola = new Map<number, (t: number) => void>();
  const cancelados: number[] = [];
  const animador: Animador = {
    ahora: () => reloj,
    pedirCuadro: (cb) => {
      const id = siguiente++;
      cola.set(id, cb);
      return id;
    },
    cancelarCuadro: (id) => {
      cancelados.push(id);
      cola.delete(id);
    },
  };
  return {
    animador,
    cancelados,
    pendientes: () => cola.size,
    avanzar(ms: number) {
      reloj += ms;
      const actuales = [...cola.entries()];
      cola.clear();
      act(() => {
        for (const [, cb] of actuales) cb(reloj);
      });
    },
  };
}

function Arnes(props: {
  giro: PlanGiro | null;
  n: number;
  animador: Animador;
  alTerminar(): void;
}) {
  const { refGrupo, tics } = useGiro(props);
  return (
    <svg>
      <g ref={refGrupo} data-testid="grupo" />
      <text data-testid="tics">{tics}</text>
    </svg>
  );
}

const plan = (extra: Partial<PlanGiro> = {}): PlanGiro => ({
  indice: 0,
  desde: 0,
  delta: 720,
  duracionMs: 1000,
  conTic: true,
  ...extra,
});

const leer = (c: HTMLElement) => ({
  transform: c.querySelector('g')!.getAttribute('transform'),
  tics: Number(c.querySelector('text')!.textContent),
});

describe('useGiro', () => {
  it('no corre con giro null', () => {
    const f = crearAnimadorFalso();
    const alTerminar = vi.fn();
    const { container } = render(
      <Arnes giro={null} n={4} animador={f.animador} alTerminar={alTerminar} />,
    );
    expect(f.pendientes()).toBe(0);
    expect(container.querySelector('g')!.hasAttribute('transform')).toBe(false);
    expect(alTerminar).not.toHaveBeenCalled();
  });

  it('escribe la rotacion en el DOM y llama alTerminar una sola vez', () => {
    const f = crearAnimadorFalso();
    const alTerminar = vi.fn();
    const { container, rerender } = render(
      <Arnes giro={null} n={4} animador={f.animador} alTerminar={alTerminar} />,
    );
    rerender(<Arnes giro={plan()} n={4} animador={f.animador} alTerminar={alTerminar} />);
    expect(f.pendientes()).toBe(1);

    f.avanzar(500); // easing(.5) = .9375 -> 675
    expect(leer(container).transform).toBe('rotate(675 200 200)');
    expect(alTerminar).not.toHaveBeenCalled();

    f.avanzar(600); // pasado el final: se recorta en u=1
    expect(leer(container).transform).toBe('rotate(720 200 200)');
    expect(alTerminar).toHaveBeenCalledTimes(1);
    expect(f.pendientes()).toBe(0);

    f.avanzar(1000);
    expect(alTerminar).toHaveBeenCalledTimes(1);
  });

  it('cuenta tics cuando cambia el segmento bajo el puntero si conTic', () => {
    const f = crearAnimadorFalso();
    const { container, rerender } = render(
      <Arnes giro={null} n={4} animador={f.animador} alTerminar={() => undefined} />,
    );
    rerender(
      <Arnes giro={plan({ delta: 90 })} n={4} animador={f.animador} alTerminar={() => undefined} />,
    );
    expect(leer(container).tics).toBe(0);
    // rot = -? : con rotacion positiva el segmento bajo el puntero retrocede de a uno
    f.avanzar(1000);
    expect(leer(container).tics).toBeGreaterThan(0);
  });

  it('no cuenta tics si el plan no tiene conTic', () => {
    const f = crearAnimadorFalso();
    const { container, rerender } = render(
      <Arnes giro={null} n={4} animador={f.animador} alTerminar={() => undefined} />,
    );
    rerender(
      <Arnes
        giro={plan({ conTic: false })}
        n={4}
        animador={f.animador}
        alTerminar={() => undefined}
      />,
    );
    f.avanzar(300);
    f.avanzar(300);
    f.avanzar(600);
    expect(leer(container).tics).toBe(0);
  });

  it('el cleanup cancela el cuadro pendiente y no llama alTerminar', () => {
    const f = crearAnimadorFalso();
    const alTerminar = vi.fn();
    const { rerender, unmount } = render(
      <Arnes giro={null} n={4} animador={f.animador} alTerminar={alTerminar} />,
    );
    rerender(<Arnes giro={plan()} n={4} animador={f.animador} alTerminar={alTerminar} />);
    f.avanzar(100);
    expect(f.pendientes()).toBe(1);
    unmount();
    expect(f.cancelados).toHaveLength(1);
    expect(f.pendientes()).toBe(0);
    f.avanzar(2000);
    expect(alTerminar).not.toHaveBeenCalled();
  });

  it('usa el ultimo alTerminar sin reiniciar el bucle', () => {
    const f = crearAnimadorFalso();
    const primero = vi.fn();
    const segundo = vi.fn();
    const { rerender } = render(
      <Arnes giro={null} n={4} animador={f.animador} alTerminar={primero} />,
    );
    const p = plan();
    rerender(<Arnes giro={p} n={4} animador={f.animador} alTerminar={primero} />);
    rerender(<Arnes giro={p} n={4} animador={f.animador} alTerminar={segundo} />);
    expect(f.cancelados).toHaveLength(0);
    f.avanzar(2000);
    expect(primero).not.toHaveBeenCalled();
    expect(segundo).toHaveBeenCalledTimes(1);
  });
});
