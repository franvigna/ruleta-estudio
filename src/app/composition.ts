import { azarPendientes } from '../domain/seleccion/azar-pendientes';
import { cargadoresGenerados } from '../infra/contenido-glob';
import { crearContenidoRepo } from '../infra/contenido-repo';
import { crearLocalStorageRepo } from '../infra/local-storage-repo';
import { crearMemoryRepo } from '../infra/memory-repo';
import { migrarV1aV2, type ResultadoMigracion } from '../infra/migraciones';
import type { AlmacenClaveValor } from '../infra/progreso-repo';
import type { Animador } from '../features/ruleta';
import type { Dependencias } from './providers/DependenciasProvider';

export type { Dependencias } from './providers/DependenciasProvider';

const CLAVE_PRUEBA = 'ruleta-estudio:prueba';

/** Devuelve localStorage si se puede escribir en el, o null (Safari privado, cuota, bloqueado). */
function probarAlmacen(w: Window): AlmacenClaveValor | null {
  try {
    const almacen = w.localStorage;
    almacen.setItem(CLAVE_PRUEBA, '1');
    almacen.removeItem(CLAVE_PRUEBA);
    return almacen;
  } catch {
    return null;
  }
}

function crearAnimador(w: Window): Animador {
  return {
    ahora: () => w.performance.now(),
    pedirCuadro: (cb) => w.requestAnimationFrame(cb),
    cancelarCuadro: (id) => w.cancelAnimationFrame(id),
  };
}

/** Unico lugar que arma las dependencias reales (y el unico que puede usar Math.random). */
export function crearDependencias(w: Window = window): Dependencias {
  const almacen = probarAlmacen(w);
  let migracion: ResultadoMigracion = { estado: 'sin-datos' };
  if (almacen) migracion = migrarV1aV2(almacen);
  if (migracion.estado === 'error' || migracion.estado === 'invalido') {
    console.warn('No se pudo migrar el progreso de la version anterior:', migracion);
  }
  return {
    progresoRepo: almacen ? crearLocalStorageRepo(almacen) : crearMemoryRepo(),
    persistente: almacen !== null,
    contenido: crearContenidoRepo(cargadoresGenerados),
    rng: () => Math.random(),
    animador: crearAnimador(w),
    reducido: w.matchMedia('(prefers-reduced-motion: reduce)').matches,
    estrategia: azarPendientes,
    migracion,
  };
}
