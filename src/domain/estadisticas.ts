import { marcaDe } from './progreso';
import { fallosDe } from './progreso';
import type { Marca, Materia, Pregunta, Progreso, Tema } from './types';

export interface Conteo {
  readonly total: number;
  readonly si: number;
  readonly no: number;
  readonly sin: number;
  readonly pct: number;
}

export interface EstadisticaTema extends Conteo {
  readonly tema: Tema;
}

export interface TemaAReforzar extends EstadisticaTema {
  /** no / (si + no) */
  readonly tasaError: number;
}

export interface PreguntaDificil {
  readonly pregunta: Pregunta;
  readonly tema: Tema;
  readonly fallos: number;
  readonly marca: Marca | undefined;
}

function conteo(ids: readonly string[], p: Progreso): Conteo {
  let si = 0;
  let no = 0;
  for (const id of ids) {
    const m = marcaDe(p, id);
    if (m === 'si') si++;
    else if (m === 'no') no++;
  }
  const total = ids.length;
  const pct = total === 0 ? 0 : Math.round((100 * si) / total);
  return { total, si, no, sin: total - si - no, pct };
}

export function estadisticasTema(t: Tema, p: Progreso): EstadisticaTema {
  return {
    ...conteo(
      t.preguntas.map((q) => q.id),
      p,
    ),
    tema: t,
  };
}

/** En el orden de la ruleta. */
export function estadisticasPorTema(m: Materia, p: Progreso): readonly EstadisticaTema[] {
  return m.temas.map((t) => estadisticasTema(t, p));
}

/** Solo cuenta ids de la materia: ignora huerfanos. */
export function resumenMateria(m: Materia, p: Progreso): Conteo {
  return conteo(
    m.temas.flatMap((t) => t.preguntas.map((q) => q.id)),
    p,
  );
}

/**
 * Temas con alguna 'no', por tasa de error desc, luego mas 'no', luego menor pct.
 * El empate total conserva el orden de la ruleta (sort estable).
 */
export function temasAReforzar(m: Materia, p: Progreso, limite = 3): readonly TemaAReforzar[] {
  return estadisticasPorTema(m, p)
    .filter((e) => e.no > 0)
    .map((e) => ({ ...e, tasaError: e.no / (e.si + e.no) }))
    .sort((a, b) => b.tasaError - a.tasaError || b.no - a.no || a.pct - b.pct)
    .slice(0, limite);
}

/** Para el catalogo, que no tiene ids de preguntas: se recorta a 100. */
export function porcentajeAproximado(p: Progreso, cantidadPreguntas: number): number {
  if (cantidadPreguntas <= 0) return 0;
  const si = Object.values(p.marcas).filter((v) => v === 'si').length;
  return Math.min(100, Math.round((100 * si) / cantidadPreguntas));
}

/** Preguntas con fallos, ordenadas de mayor a menor dificultad acumulada. */
export function preguntasMasDificiles(
  materia: Materia,
  progreso: Progreso,
  limite = 10,
): readonly PreguntaDificil[] {
  return materia.temas
    .flatMap((tema) =>
      tema.preguntas.map((pregunta) => ({
        pregunta,
        tema,
        fallos: fallosDe(progreso, pregunta.id),
        marca: marcaDe(progreso, pregunta.id),
      })),
    )
    .filter((item) => item.fallos > 0)
    .sort((a, b) => b.fallos - a.fallos)
    .slice(0, limite);
}
