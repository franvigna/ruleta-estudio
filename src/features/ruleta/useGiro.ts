import { useEffect, useRef, useState, type RefObject } from 'react';
import { rotacionEn, segmentoBajoPuntero, type PlanGiro } from '../../domain/ruleta-math';
import type { Animador } from './animador';

interface OpcionesGiro {
  giro: PlanGiro | null;
  n: number;
  animador: Animador;
  alTerminar(): void;
}

/**
 * Corre el bucle de animacion del giro escribiendo el transform directo en el
 * <g> (sin re-render por cuadro) y cuenta un tic por cada segmento que pasa
 * bajo el puntero (solo si el plan lo pide).
 */
export function useGiro({ giro, n, animador, alTerminar }: OpcionesGiro): {
  refGrupo: RefObject<SVGGElement>;
  tics: number;
} {
  const refGrupo = useRef<SVGGElement>(null);
  const [tics, setTics] = useState(0);
  const refAlTerminar = useRef(alTerminar);
  useEffect(() => {
    refAlTerminar.current = alTerminar;
  });

  useEffect(() => {
    if (!giro) return;
    const t0 = animador.ahora();
    let ultimo = segmentoBajoPuntero(giro.desde, n);
    let id = 0;
    let terminado = false;
    const paso = (ahora: number) => {
      const { rot, terminado: fin } = rotacionEn(giro, ahora - t0);
      refGrupo.current?.setAttribute('transform', `rotate(${rot} 200 200)`);
      const bajo = segmentoBajoPuntero(rot, n);
      if (bajo !== ultimo) {
        ultimo = bajo;
        if (giro.conTic) setTics((t) => t + 1);
      }
      if (fin) {
        if (!terminado) {
          terminado = true;
          refAlTerminar.current();
        }
      } else {
        id = animador.pedirCuadro(paso);
      }
    };
    id = animador.pedirCuadro(paso);
    return () => animador.cancelarCuadro(id);
  }, [giro, n, animador]);

  return { refGrupo, tics };
}
