import {
  actual,
  agregar,
  avanzar,
  historialCon,
  historialVacio,
  puedeAvanzar,
  puedeRetroceder,
  retroceder,
  type Historial,
  type RefPregunta,
} from './historial';
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
      /** Evita sumar dos fallos por clics repetidos en la misma presentacion. */
      readonly falloContado: boolean;
    };

export interface EstadoSesion<E> {
  readonly rot: number;
  readonly giro: PlanGiro | null;
  readonly ganador: number | null;
  readonly contenido: Contenido;
  readonly estrategia: E;
  /** Preguntas vistas desde el ultimo giro; se vacia al sortear un tema nuevo. */
  readonly historial: Historial;
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
    historial: historialVacio,
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
  listaNueva = false,
): EstadoSesion<E> {
  const r = est.sacarPregunta(ctx, s.estrategia, temaId, rng);
  if (!r) return girar(s, ctx, est, reducido, rng);
  const ref = { temaId, preguntaId: r.preguntaId };
  return {
    ...s,
    estrategia: r.estado,
    historial: listaNueva ? historialCon(ref) : agregar(s.historial, ref),
    contenido: tarjetaDe(ctx, ref),
  };
}

/** Tarjeta de frente. Al revisitar una pregunta ya marcada, sus botones quedan disponibles. */
function tarjetaDe(ctx: ContextoSeleccion, ref: RefPregunta, revisita = false): Contenido {
  const marca = marcaDe(ctx.progreso, ref.preguntaId);
  return {
    tipo: 'tarjeta',
    temaId: ref.temaId,
    preguntaId: ref.preguntaId,
    dada: false,
    marcarVisible: revisita && marca !== undefined,
    repaso: marca === 'no',
    falloContado: false,
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
  return mostrar(terminado, ctx, est, tema.id, reducido, rng, true);
}

/**
 * Si hay giro no hace nada. Si el cursor esta en medio del historial avanza a la
 * siguiente ya vista; en el final saca otra pregunta del tema y la agrega.
 */
export function otraDelTema<E>(
  s: EstadoSesion<E>,
  ctx: ContextoSeleccion,
  est: EstrategiaSeleccion<E>,
  reducido: boolean,
  rng: Rng,
): EstadoSesion<E> {
  if (s.giro || s.contenido.tipo !== 'tarjeta') return s;
  if (puedeAvanzar(s.historial)) return irA(s, ctx, avanzar(s.historial));
  return mostrar(s, ctx, est, s.contenido.temaId, reducido, rng);
}

/** Vuelve a la pregunta anterior del historial; sin giro ni anterior no hace nada. */
export function anterior<E>(s: EstadoSesion<E>, ctx: ContextoSeleccion): EstadoSesion<E> {
  if (s.giro || s.contenido.tipo !== 'tarjeta' || !puedeRetroceder(s.historial)) return s;
  return irA(s, ctx, retroceder(s.historial));
}

function irA<E>(s: EstadoSesion<E>, ctx: ContextoSeleccion, historial: Historial): EstadoSesion<E> {
  const ref = actual(historial);
  if (!ref) return s;
  return { ...s, historial, contenido: tarjetaDe(ctx, ref, true) };
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
