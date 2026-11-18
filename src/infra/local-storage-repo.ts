import { z } from 'zod';
import type { Marca, MateriaId, Progreso } from '../domain/types';
import {
  ErrorAlmacenamiento,
  type AlmacenClaveValor,
  type ProgresoRepositorio,
} from './progreso-repo';

export const CLAVE_V2 = 'ruleta-estudio:progreso:v2';

const AlmacenV2Schema = z.object({
  version: z.literal(2),
  materias: z.record(z.string(), z.object({ marcas: z.record(z.string(), z.unknown()) })),
});

export interface AlmacenV2 {
  version: 2;
  materias: Record<MateriaId, { marcas: Record<string, Marca> }>;
}

function soloMarcasValidas(marcas: Record<string, unknown>): Record<string, Marca> {
  const salida: Record<string, Marca> = {};
  for (const [id, m] of Object.entries(marcas)) {
    if (m === 'si' || m === 'no') salida[id] = m;
  }
  return salida;
}

/** Parsea el texto del almacen v2. Lanza si no es JSON o no cumple la forma. */
export function parsearAlmacenV2(texto: string): AlmacenV2 {
  const crudo = AlmacenV2Schema.parse(JSON.parse(texto));
  const materias: AlmacenV2['materias'] = {};
  for (const [id, m] of Object.entries(crudo.materias)) {
    materias[id] = { marcas: soloMarcasValidas(m.marcas) };
  }
  return { version: 2, materias };
}

/** null si falta; lanza si el JSON es invalido. */
export function leerAlmacenV2(almacen: AlmacenClaveValor): AlmacenV2 | null {
  const texto = almacen.getItem(CLAVE_V2);
  return texto === null ? null : parsearAlmacenV2(texto);
}

function leerTolerante(almacen: AlmacenClaveValor): AlmacenV2 {
  try {
    return leerAlmacenV2(almacen) ?? { version: 2, materias: {} };
  } catch {
    return { version: 2, materias: {} };
  }
}

function aError(e: unknown): Error {
  return e instanceof Error ? e : new ErrorAlmacenamiento(String(e));
}

export function crearLocalStorageRepo(almacen: AlmacenClaveValor): ProgresoRepositorio {
  function escribir(doc: AlmacenV2): void {
    try {
      almacen.setItem(CLAVE_V2, JSON.stringify(doc));
    } catch (causa) {
      throw new ErrorAlmacenamiento('No se pudo guardar el progreso', { cause: causa });
    }
  }

  return {
    cargar(materiaId) {
      const marcas = leerTolerante(almacen).materias[materiaId]?.marcas ?? {};
      const progreso: Progreso = { marcas };
      return Promise.resolve(progreso);
    },
    guardar(materiaId, p) {
      try {
        const doc = leerTolerante(almacen);
        doc.materias[materiaId] = { marcas: soloMarcasValidas({ ...p.marcas }) };
        escribir(doc);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(aError(e));
      }
    },
    reiniciar(materiaId) {
      try {
        const doc = leerTolerante(almacen);
        delete doc.materias[materiaId];
        escribir(doc);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(aError(e));
      }
    },
  };
}
