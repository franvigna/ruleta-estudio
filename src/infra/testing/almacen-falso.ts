import type { AlmacenClaveValor } from '../progreso-repo';

export interface OpcionesAlmacenFalso {
  datos?: Record<string, string>;
  lanzarEnGet?: boolean;
  lanzarEnSet?: boolean;
  lanzarEnRemove?: boolean;
  /** setItem no lanza pero no persiste (almacen que "miente"). */
  ignorarSet?: boolean;
}

export interface AlmacenFalso extends AlmacenClaveValor {
  readonly datos: Map<string, string>;
}

export function crearAlmacenFalso(opciones: OpcionesAlmacenFalso = {}): AlmacenFalso {
  const datos = new Map<string, string>(Object.entries(opciones.datos ?? {}));
  return {
    datos,
    getItem(k) {
      if (opciones.lanzarEnGet) throw new Error('getItem falla');
      return datos.get(k) ?? null;
    },
    setItem(k, v) {
      if (opciones.lanzarEnSet) throw new Error('setItem falla');
      if (opciones.ignorarSet) return;
      datos.set(k, v);
    },
    removeItem(k) {
      if (opciones.lanzarEnRemove) throw new Error('removeItem falla');
      datos.delete(k);
    },
  };
}
