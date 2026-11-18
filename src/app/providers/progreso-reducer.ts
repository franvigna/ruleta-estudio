import type { MateriaId, Progreso } from '../../domain/types';

export type EntradaMateria =
  { readonly estado: 'cargando' } | { readonly estado: 'listo'; readonly progreso: Progreso };

export interface EstadoProgreso {
  readonly porMateria: Readonly<Record<MateriaId, EntradaMateria>>;
  /** true si el ultimo guardado fallo; el siguiente guardado ok lo vuelve a false. */
  readonly guardadoFallido: boolean;
  /** false si el almacenamiento no esta disponible al iniciar. */
  readonly persistente: boolean;
}

export type AccionProgreso =
  | { readonly tipo: 'cargaIniciada'; readonly materiaId: MateriaId }
  | { readonly tipo: 'cargado'; readonly materiaId: MateriaId; readonly progreso: Progreso }
  /** Solo memoria: no se persiste hasta el proximo guardado (como el legacy). */
  | {
      readonly tipo: 'huerfanosLimpiados';
      readonly materiaId: MateriaId;
      readonly progreso: Progreso;
    }
  | { readonly tipo: 'marcado'; readonly materiaId: MateriaId; readonly progreso: Progreso }
  | { readonly tipo: 'reiniciado'; readonly materiaId: MateriaId; readonly progreso: Progreso }
  | { readonly tipo: 'guardadoResultado'; readonly ok: boolean };

export function estadoInicial(persistente: boolean): EstadoProgreso {
  return { porMateria: {}, guardadoFallido: false, persistente };
}

function conProgreso(s: EstadoProgreso, materiaId: MateriaId, progreso: Progreso): EstadoProgreso {
  return {
    ...s,
    porMateria: { ...s.porMateria, [materiaId]: { estado: 'listo', progreso } },
  };
}

export function progresoReducer(s: EstadoProgreso, a: AccionProgreso): EstadoProgreso {
  switch (a.tipo) {
    case 'cargaIniciada':
      if (s.porMateria[a.materiaId]) return s;
      return { ...s, porMateria: { ...s.porMateria, [a.materiaId]: { estado: 'cargando' } } };
    case 'cargado':
    case 'huerfanosLimpiados':
    case 'marcado':
    case 'reiniciado':
      return conProgreso(s, a.materiaId, a.progreso);
    case 'guardadoResultado':
      if (s.guardadoFallido === !a.ok) return s;
      return { ...s, guardadoFallido: !a.ok };
  }
}
