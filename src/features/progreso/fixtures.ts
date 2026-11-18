import type { EstadisticaTema, TemaAReforzar } from '../../domain/estadisticas';
import type { Tema } from '../../domain/types';

/** Datos armados a mano para los tests de esta feature. */
export function temaDe(id: string, nombre: string, area: string): Tema {
  return { id, nombre, etiquetaCorta: nombre.slice(0, 4), area, preguntas: [] };
}

export function estadistica(tema: Tema, si: number, no: number, sin: number): EstadisticaTema {
  const total = si + no + sin;
  return { tema, total, si, no, sin, pct: total === 0 ? 0 : Math.round((100 * si) / total) };
}

export function aReforzar(e: EstadisticaTema): TemaAReforzar {
  return { ...e, tasaError: e.no / (e.si + e.no) };
}
