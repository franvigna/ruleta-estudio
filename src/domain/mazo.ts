import { estaPendiente, pendientesDelTema } from './progreso';
import { mezclar, type Rng } from './random';
import type { PreguntaId, Progreso, Tema, TemaId } from './types';

export type Mazos = Readonly<Record<TemaId, readonly PreguntaId[]>>;

export const mazosVacios: Mazos = {};

export interface ResultadoSacar {
  readonly preguntaId: PreguntaId;
  readonly mazos: Mazos;
}

/**
 * Replica de sacar(tid) del legacy. El mazo guarda ids; las 'si' marcadas desde
 * que se armo se filtran; al vaciarse se rearma mezclando los pendientes y, si
 * el ultimo es la pregunta anterior (y hay mas de una), pasa al principio.
 * Sin pendientes devuelve null y no consume rng.
 */
export function sacarDelMazo(
  mazos: Mazos,
  tema: Tema,
  p: Progreso,
  anteriorId: PreguntaId | null,
  rng: Rng,
): ResultadoSacar | null {
  let m = (mazos[tema.id] ?? []).filter((id) => estaPendiente(p, id));
  if (m.length === 0) {
    const pendientes = pendientesDelTema(tema, p);
    if (pendientes.length === 0) return null;
    m = mezclar(
      pendientes.map((q) => q.id),
      rng,
    );
    if (m.length > 1 && m[m.length - 1] === anteriorId) {
      m.unshift(m.pop() as PreguntaId);
    }
  }
  const preguntaId = m.pop() as PreguntaId;
  return { preguntaId, mazos: { ...mazos, [tema.id]: m } };
}
