import type { Marca } from '../domain/types';
import { CLAVE_V2, parsearAlmacenV2, type AlmacenV2 } from './local-storage-repo';
import type { AlmacenClaveValor } from './progreso-repo';

export const CLAVE_V1 = 'ruleta-pa:progreso:v1';
export const CLAVE_RESPALDO_V1 = `${CLAVE_V1}:respaldo`;
export const MATERIA_V1 = 'programacion-avanzada';

export type ResultadoMigracion =
  | { estado: 'sin-datos' }
  | { estado: 'migrado'; cantidad: number }
  | { estado: 'invalido' }
  | { estado: 'error'; causa: unknown };

/** Devuelve las marcas si el texto es un v1 valido ({"r":{...}}), o null. */
function parsearV1(texto: string): Record<string, Marca> | null {
  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    return null;
  }
  if (typeof crudo !== 'object' || crudo === null) return null;
  if (Array.isArray(crudo)) return null;
  const r = (crudo as { r?: unknown }).r;
  // Sin clave `r` equivale a vacio en el legacy (JSON.parse(s).r || {}).
  if (r === undefined) return {};
  if (typeof r !== 'object' || r === null || Array.isArray(r)) return null;
  const marcas: Record<string, Marca> = {};
  for (const [id, m] of Object.entries(r)) {
    if (m === 'si' || m === 'no') marcas[id] = m;
  }
  return marcas;
}

/** Migra el progreso del formato legacy al v2. Nunca lanza. */
export function migrarV1aV2(almacen: AlmacenClaveValor): ResultadoMigracion {
  try {
    const textoV1 = almacen.getItem(CLAVE_V1);
    if (textoV1 === null) return { estado: 'sin-datos' };
    const marcasV1 = parsearV1(textoV1);
    if (marcasV1 === null) return { estado: 'invalido' };

    const textoV2 = almacen.getItem(CLAVE_V2);
    let doc: AlmacenV2;
    if (textoV2 === null) {
      doc = { version: 2, materias: {} };
    } else {
      try {
        doc = parsearAlmacenV2(textoV2);
      } catch {
        return { estado: 'invalido' };
      }
    }

    const existentes = doc.materias[MATERIA_V1]?.marcas ?? {};
    const hayConflicto = Object.entries(marcasV1).some(
      ([id, m]) => existentes[id] !== undefined && existentes[id] !== m,
    );
    const combinadas = { ...marcasV1, ...existentes };
    doc.materias[MATERIA_V1] = { marcas: combinadas };
    almacen.setItem(CLAVE_V2, JSON.stringify(doc));

    const releido = almacen.getItem(CLAVE_V2);
    if (releido === null) return { estado: 'error', causa: new Error('Relectura vacia') };
    const marcasReleidas = parsearAlmacenV2(releido).materias[MATERIA_V1]?.marcas ?? {};
    for (const id of Object.keys(marcasV1)) {
      if (marcasReleidas[id] !== combinadas[id]) {
        return { estado: 'error', causa: new Error(`La relectura no coincide para ${id}`) };
      }
    }

    if (hayConflicto) {
      // Gana v2, pero el original de v1 se conserva antes de borrarlo.
      let clave = CLAVE_RESPALDO_V1;
      for (let n = 2; almacen.getItem(clave) !== null; n++) clave = `${CLAVE_RESPALDO_V1}-${n}`;
      almacen.setItem(clave, textoV1);
    }

    almacen.removeItem(CLAVE_V1);
    return { estado: 'migrado', cantidad: Object.keys(marcasV1).length };
  } catch (causa) {
    return { estado: 'error', causa };
  }
}
