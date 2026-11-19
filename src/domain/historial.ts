import type { PreguntaId, TemaId } from './types';

export interface RefPregunta {
  readonly temaId: TemaId;
  readonly preguntaId: PreguntaId;
}

/**
 * Preguntas que salieron desde el ultimo giro, con un cursor. Equivale a una lista
 * doblemente enlazada: se puede ir hacia atras y hacia adelante sin perder lo recorrido.
 */
export interface Historial {
  readonly items: readonly RefPregunta[];
  /** Posicion de la pregunta visible; -1 cuando la lista esta vacia. */
  readonly indice: number;
}

export const historialVacio: Historial = { items: [], indice: -1 };

export function historialCon(ref: RefPregunta): Historial {
  return { items: [ref], indice: 0 };
}

/** Agrega al final y deja el cursor en la nueva pregunta. */
export function agregar(h: Historial, ref: RefPregunta): Historial {
  const items = [...h.items, ref];
  return { items, indice: items.length - 1 };
}

export function puedeRetroceder(h: Historial): boolean {
  return h.indice > 0;
}

export function puedeAvanzar(h: Historial): boolean {
  return h.indice >= 0 && h.indice < h.items.length - 1;
}

export function retroceder(h: Historial): Historial {
  return puedeRetroceder(h) ? { ...h, indice: h.indice - 1 } : h;
}

export function avanzar(h: Historial): Historial {
  return puedeAvanzar(h) ? { ...h, indice: h.indice + 1 } : h;
}

export function actual(h: Historial): RefPregunta | undefined {
  return h.items[h.indice];
}
