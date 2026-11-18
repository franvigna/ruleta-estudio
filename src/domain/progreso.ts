import type { Marca, Materia, Pregunta, PreguntaId, Progreso, Tema } from './types';

export const progresoVacio: Progreso = { marcas: {} };

export function marcaDe(p: Progreso, id: PreguntaId): Marca | undefined {
  return p.marcas[id];
}

/** Devuelve la misma referencia si la marca ya era esa. */
export function marcar(p: Progreso, id: PreguntaId, m: Marca): Progreso {
  if (p.marcas[id] === m) return p;
  return { ...p, marcas: { ...p.marcas, [id]: m } };
}

export function reiniciar(): Progreso {
  return progresoVacio;
}

/** Quita marcas de preguntas que ya no existen. Misma referencia si no habia. */
export function limpiarHuerfanos(p: Progreso, idsValidos: ReadonlySet<PreguntaId>): Progreso {
  const entradas = Object.entries(p.marcas);
  const validas = entradas.filter(([id]) => idsValidos.has(id));
  if (validas.length === entradas.length) return p;
  return { ...p, marcas: Object.fromEntries(validas) };
}

export function idsDeMateria(m: Materia): ReadonlySet<PreguntaId> {
  return new Set(m.temas.flatMap((t) => t.preguntas.map((q) => q.id)));
}

/** Una 'no' sigue pendiente: solo la 'si' saca la pregunta de la ruleta. */
export function estaPendiente(p: Progreso, id: PreguntaId): boolean {
  return p.marcas[id] !== 'si';
}

export function pendientesDelTema(t: Tema, p: Progreso): readonly Pregunta[] {
  return t.preguntas.filter((q) => estaPendiente(p, q.id));
}

export function temaCompleto(t: Tema, p: Progreso): boolean {
  return pendientesDelTema(t, p).length === 0;
}
