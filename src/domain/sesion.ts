import { marcaDe } from './progreso';
import type { Rng } from './random';
import { planificarGiro, type PlanGiro } from './ruleta-math';
import type { ContextoSeleccion, EstrategiaSeleccion } from './seleccion/estrategia';
import type { PreguntaId, TemaId } from './types';

export type Contenido =
  | { readonly tipo: 'vacio' }
  | { readonly tipo: 'todo-sabido' }
  | {
      readonly tipo: 'tarjeta';
      readonly temaId: TemaId;
      readonly preguntaId: PreguntaId;
      readonly dada: boolean;
      readonly marcarVisible: boolean;
      readonly repaso: boolean;
    };

export interface EstadoSesion<E> {
  readonly rot: number;
  readonly giro: PlanGiro | null;
  readonly ganador: number | null;
  readonly contenido: Contenido;
  readonly estrategia: E;
}

export type EstadoPantalla = 'inactivo' | 'girando' | 'mostrando';

export function estadoPantalla<E>(s: EstadoSesion<E>): EstadoPantalla {
  if (s.giro) return 'girando';
  return s.contenido.tipo === 'tarjeta' ? 'mostrando' : 'inactivo';
}

export function sesionInicial<E>(e: EstrategiaSeleccion<E>): EstadoSesion<E> {
  return {
    rot: 0,
    giro: null,
    ganador: null,
    contenido: { tipo: 'vacio' },
    estrategia: e.estadoInicial(),
  };
}

/**
 * Si hay giro en curso no hace nada. No reemplaza la tarjeta: la anterior queda
 * visible mientras gira (como el legacy). Consumo de rng: elegirTema, desvio, vueltas.
 */
export function girar<E>(
  s: EstadoSesion<E>,
  ctx: ContextoSeleccion,
  est: EstrategiaSeleccion<E>,
  reducido: boolean,
  rng: Rng,
): EstadoSesion<E> {
  if (s.giro) return s;
  const temaId = est.elegirTema(ctx, rng);
  const indice = temaId === null ? -1 : ctx.materia.temas.findIndex((t) => t.id === temaId);
  if (indice < 0) return { ...s, contenido: { tipo: 'todo-sabido' } };
  const giro = planificarGiro(indice, ctx.materia.temas.length, s.rot, reducido, rng);
  return { ...s, giro, ganador: null };
}

/**
 * Sin pendientes en el tema vuelve a girar (como mostrar()->girar() del legacy).
 * Con pendientes: tarjeta nueva; "repaso" es una foto de la marca en este instante.
 */
export function mostrar<E>(
  s: EstadoSesion<E>,
  ctx: ContextoSeleccion,
  est: EstrategiaSeleccion<E>,
  temaId: TemaId,
  reducido: boolean,
  rng: Rng,
): EstadoSesion<E> {
  const r = est.sacarPregunta(ctx, s.estrategia, temaId, rng);
  if (!r) return girar(s, ctx, est, reducido, rng);
  return {
    ...s,
    estrategia: r.estado,
    contenido: {
      tipo: 'tarjeta',
      temaId,
      preguntaId: r.preguntaId,
      dada: false,
      marcarVisible: false,
      repaso: marcaDe(ctx.progreso, r.preguntaId) === 'no',
    },
  };
}

export function terminarGiro<E>(
  s: EstadoSesion<E>,
  ctx: ContextoSeleccion,
  est: EstrategiaSeleccion<E>,
  reducido: boolean,
  rng: Rng,
): EstadoSesion<E> {
  if (!s.giro) return s;
  const { indice, desde, delta } = s.giro;
  const terminado: EstadoSesion<E> = { ...s, rot: desde + delta, giro: null, ganador: indice };
  const tema = ctx.materia.temas[indice];
  if (!tema) return terminado;
  return mostrar(terminado, ctx, est, tema.id, reducido, rng);
}

/** Si hay giro no hace nada; si no, otra pregunta del tema de la tarjeta actual. */
export function otraDelTema<E>(
  s: EstadoSesion<E>,
  ctx: ContextoSeleccion,
  est: EstrategiaSeleccion<E>,
  reducido: boolean,
  rng: Rng,
): EstadoSesion<E> {
  if (s.giro || s.contenido.tipo !== 'tarjeta') return s;
  return mostrar(s, ctx, est, s.contenido.temaId, reducido, rng);
}

/** Alterna dada; una vez dada, marcarVisible queda en true aunque se vuelva al frente. */
export function voltear<E>(s: EstadoSesion<E>): EstadoSesion<E> {
  const c = s.contenido;
  if (c.tipo !== 'tarjeta') return s;
  const dada = !c.dada;
  return { ...s, contenido: { ...c, dada, marcarVisible: c.marcarVisible || dada } };
}

export function puedeMarcar<E>(s: EstadoSesion<E>): boolean {
  return s.contenido.tipo === 'tarjeta' && s.contenido.marcarVisible;
}

export function alReiniciar<E>(s: EstadoSesion<E>, est: EstrategiaSeleccion<E>): EstadoSesion<E> {
  const c = s.contenido;
  return {
    ...s,
    estrategia: est.alReiniciar(s.estrategia),
    contenido: c.tipo === 'tarjeta' ? { ...c, repaso: false } : c,
  };
}
