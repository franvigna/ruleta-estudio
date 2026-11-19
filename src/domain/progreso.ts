import type { Marca, Materia, Pregunta, PreguntaId, Progreso, Tema } from './types';

export const progresoVacio: Progreso = { marcas: {} };

export function marcaDe(p: Progreso, id: PreguntaId): Marca | undefined {
  return p.marcas[id];
}

export function fallosDe(p: Progreso, id: PreguntaId): number {
  return p.fallos?.[id] ?? 0;
}

/** Devuelve la misma referencia si la marca ya era esa. */
export function marcar(p: Progreso, id: PreguntaId, m: Marca): Progreso {
  if (p.marcas[id] === m) return p;
  return { ...p, marcas: { ...p.marcas, [id]: m } };
}

/** Registra un intento fallido sin cambiar por si solo la marca visible. */
export function registrarFallo(p: Progreso, id: PreguntaId): Progreso {
  return { ...p, fallos: { ...p.fallos, [id]: fallosDe(p, id) + 1 } };
}

/**
 * Une dos progresos de la misma materia sin perder datos. Una pregunta vista en
 * cualquiera de los dos queda vista; si en alguno esta como "no", queda "no"; y de los
 * fallos se conserva el mayor.
 */
export function combinarProgreso(a: Progreso, b: Progreso): Progreso {
  const marcas: Record<PreguntaId, Marca> = { ...a.marcas };
  for (const [id, marca] of Object.entries(b.marcas)) {
    marcas[id] = marcas[id] === 'no' ? 'no' : marca;
  }
  const fallos: Record<PreguntaId, number> = { ...a.fallos };
  for (const [id, cantidad] of Object.entries(b.fallos ?? {})) {
    fallos[id] = Math.max(fallos[id] ?? 0, cantidad);
  }
  return { marcas, ...(Object.keys(fallos).length > 0 ? { fallos } : {}) };
}

export function reiniciar(): Progreso {
  return progresoVacio;
}

/** Quita marcas de preguntas que ya no existen. Misma referencia si no habia. */
export function limpiarHuerfanos(p: Progreso, idsValidos: ReadonlySet<PreguntaId>): Progreso {
  const entradas = Object.entries(p.marcas);
  const validas = entradas.filter(([id]) => idsValidos.has(id));
  const entradasFallos = Object.entries(p.fallos ?? {});
  const fallosValidos = entradasFallos.filter(([id]) => idsValidos.has(id));
  if (validas.length === entradas.length && fallosValidos.length === entradasFallos.length)
    return p;
  return {
    ...p,
    marcas: Object.fromEntries(validas),
    ...(p.fallos ? { fallos: Object.fromEntries(fallosValidos) } : {}),
  };
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
