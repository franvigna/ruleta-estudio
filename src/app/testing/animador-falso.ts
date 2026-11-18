import { act } from '@testing-library/react';
import type { Animador } from '../../features/ruleta';

export interface AnimadorFalso extends Animador {
  /** Avanza el reloj manual y ejecuta (dentro de act) los cuadros que estaban en cola. */
  avanzar(ms: number): void;
  /** Cantidad de cuadros pendientes. */
  pendientes(): number;
}

/** Animador con reloj manual: no usa requestAnimationFrame ni timers globales. */
export function crearAnimadorFalso(): AnimadorFalso {
  let reloj = 1000;
  let siguiente = 1;
  const cola = new Map<number, (t: number) => void>();
  return {
    ahora: () => reloj,
    pedirCuadro(cb) {
      const id = siguiente++;
      cola.set(id, cb);
      return id;
    },
    cancelarCuadro(id) {
      cola.delete(id);
    },
    pendientes: () => cola.size,
    avanzar(ms) {
      reloj += ms;
      const actuales = [...cola.values()];
      cola.clear();
      act(() => {
        for (const cb of actuales) cb(reloj);
      });
    },
  };
}
