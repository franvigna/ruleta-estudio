import type { Rng } from '../random';
import type { Materia, PreguntaId, Progreso, TemaId } from '../types';

export interface ContextoSeleccion {
  readonly materia: Materia;
  readonly progreso: Progreso;
  /** La pregunta visible en ese momento (de cualquier tema). */
  readonly anteriorId: PreguntaId | null;
}

/** Estrategia de seleccion con estado opaco E (mazos, repeticion espaciada, etc). */
export interface EstrategiaSeleccion<E> {
  readonly id: string;
  estadoInicial(): E;
  /** Temas sorteables; los demas se atenuan en la rueda. */
  temasDisponibles(ctx: ContextoSeleccion): readonly TemaId[];
  /** null = no queda nada ("te sabes todas"). */
  elegirTema(ctx: ContextoSeleccion, rng: Rng): TemaId | null;
  /** null = el tema ya no tiene nada. */
  sacarPregunta(
    ctx: ContextoSeleccion,
    estado: E,
    temaId: TemaId,
    rng: Rng,
  ): { preguntaId: PreguntaId; estado: E } | null;
  alReiniciar(estado: E): E;
}
