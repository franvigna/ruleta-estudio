import { fallosDe, pendientesDelTema } from './progreso';
import type { Rng } from './random';
import type { PreguntaId, Progreso, Tema, TemaId } from './types';

export type Mazos = Readonly<Record<TemaId, readonly PreguntaId[]>>;

export const mazosVacios: Mazos = {};

export interface ResultadoSacar {
  readonly preguntaId: PreguntaId;
  readonly mazos: Mazos;
}

/**
 * Seleccion ponderada entre pendientes. Cada pregunta pesa 1 + sus fallos, de
 * modo que las que mas costaron tienen mas probabilidades. Evita repetir la
 * anterior si existe otra alternativa. `mazos` se conserva como estado
 * compatible de la estrategia, aunque la seleccion ponderada no necesita cola.
 */
export function sacarDelMazo(
  mazos: Mazos,
  tema: Tema,
  p: Progreso,
  anteriorId: PreguntaId | null,
  rng: Rng,
): ResultadoSacar | null {
  const pendientes = pendientesDelTema(tema, p);
  if (pendientes.length === 0) return null;
  const sinAnterior = pendientes.filter((q) => q.id !== anteriorId);
  const candidatas = sinAnterior.length > 0 ? sinAnterior : pendientes;
  const total = candidatas.reduce((suma, q) => suma + 1 + fallosDe(p, q.id), 0);
  let objetivo = rng() * total;
  for (const pregunta of candidatas) {
    objetivo -= 1 + fallosDe(p, pregunta.id);
    if (objetivo < 0) return { preguntaId: pregunta.id, mazos };
  }
  return { preguntaId: candidatas[candidatas.length - 1]!.id, mazos };
}
