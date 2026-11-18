import type { MateriaId, Progreso } from '../domain/types';
import { ErrorAlmacenamiento, type ProgresoRepositorio } from './progreso-repo';

export function crearMemoryRepo(
  inicial: Record<MateriaId, Progreso> = {},
  opciones: { fallarAlGuardar?: boolean } = {},
): ProgresoRepositorio {
  const datos = new Map<MateriaId, Progreso>(Object.entries(inicial));
  return {
    cargar: (id) => Promise.resolve(datos.get(id) ?? { marcas: {} }),
    guardar(id, p) {
      if (opciones.fallarAlGuardar) {
        return Promise.reject(new ErrorAlmacenamiento('Fallo simulado al guardar'));
      }
      datos.set(id, p);
      return Promise.resolve();
    },
    reiniciar(id) {
      datos.delete(id);
      return Promise.resolve();
    },
  };
}
