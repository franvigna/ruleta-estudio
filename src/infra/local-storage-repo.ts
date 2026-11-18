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

const EntradaSchema = z.object({ marcas: z.record(z.string(), z.unknown()) });

export const CLAVE_RESPALDO_V2 = `${CLAVE_V2}:respaldo`;

/** Documento crudo: las materias se validan una por una al usarlas. */
interface DocCrudo {
  version: 2;
  materias: Record<string, unknown>;
}

/** null si el texto no es interpretable como v2 (JSON invalido, otra version, forma rara). */
function interpretar(texto: string): DocCrudo | null {
  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    return null;
  }
  if (typeof crudo !== 'object' || crudo === null || Array.isArray(crudo)) return null;
  const { version, materias } = crudo as { version?: unknown; materias?: unknown };
  if (version !== 2) return null;
  if (typeof materias !== 'object' || materias === null || Array.isArray(materias)) return null;
  return { version: 2, materias: { ...(materias as Record<string, unknown>) } };
}

function marcasDeEntrada(entrada: unknown): Record<string, Marca> {
  const r = EntradaSchema.safeParse(entrada);
  return r.success ? soloMarcasValidas(r.data.marcas) : {};
}

function aError(e: unknown): Error {
  return e instanceof Error ? e : new ErrorAlmacenamiento(String(e));
}

export function crearLocalStorageRepo(almacen: AlmacenClaveValor): ProgresoRepositorio {
  function escribir(doc: DocCrudo): void {
    try {
      almacen.setItem(CLAVE_V2, JSON.stringify(doc));
    } catch (causa) {
      throw new ErrorAlmacenamiento('No se pudo guardar el progreso', { cause: causa });
    }
  }

  /** Lee el documento para modificarlo. Si es ilegible, lo respalda antes de reemplazarlo. */
  function leerParaEscribir(): DocCrudo {
    try {
      const texto = almacen.getItem(CLAVE_V2);
      if (texto === null) return { version: 2, materias: {} };
      const doc = interpretar(texto);
      if (doc !== null) return doc;
      let clave = CLAVE_RESPALDO_V2;
      for (let n = 2; almacen.getItem(clave) !== null; n++) clave = `${CLAVE_RESPALDO_V2}-${n}`;
      almacen.setItem(clave, texto);
      return { version: 2, materias: {} };
    } catch (causa) {
      throw new ErrorAlmacenamiento('No se pudo leer ni respaldar el progreso', { cause: causa });
    }
  }

  return {
    cargar(materiaId) {
      let marcas: Record<string, Marca> = {};
      try {
        const texto = almacen.getItem(CLAVE_V2);
        const doc = texto === null ? null : interpretar(texto);
        if (doc !== null && Object.hasOwn(doc.materias, materiaId)) {
          marcas = marcasDeEntrada(doc.materias[materiaId]);
        }
      } catch {
        marcas = {};
      }
      const progreso: Progreso = { marcas };
      return Promise.resolve(progreso);
    },
    guardar(materiaId, p) {
      try {
        const doc = leerParaEscribir();
        // Se combina con lo almacenado para que dos pestanas no se pisen; lo de p gana.
        // Las marcas huerfanas (ids que ya no existen) quedan almacenadas: es inofensivo,
        // la UI las limpia al cargar. reiniciar() si borra toda la entrada de la materia.
        const almacenadas = Object.hasOwn(doc.materias, materiaId)
          ? marcasDeEntrada(doc.materias[materiaId])
          : {};
        doc.materias[materiaId] = {
          marcas: { ...almacenadas, ...soloMarcasValidas({ ...p.marcas }) },
        };
        escribir(doc);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(aError(e));
      }
    },
    reiniciar(materiaId) {
      try {
        const doc = leerParaEscribir();
        delete doc.materias[materiaId];
        escribir(doc);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(aError(e));
      }
    },
  };
}
