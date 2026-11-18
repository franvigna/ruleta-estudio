import type { z } from 'zod';
import type { ItemCatalogo, Materia, MateriaId } from '../domain/types';
import { CatalogoSchema, MateriaSchema } from '../content/schema';

export interface ContenidoRepositorio {
  catalogo(): Promise<readonly ItemCatalogo[]>;
  /** null = la materia no existe. */
  materia(id: MateriaId): Promise<Materia | null>;
}

export class ErrorContenido extends Error {
  constructor(mensaje: string, opciones?: { cause?: unknown }) {
    super(mensaje, opciones);
    this.name = 'ErrorContenido';
  }
}

export type Cargador = () => Promise<unknown>;

function describirIssues(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join('.') || '(raiz)'}: ${i.message}`).join('; ');
}

export function crearContenidoRepo(cargadores: {
  catalogo: Cargador | null;
  materias: Readonly<Record<MateriaId, Cargador>>;
}): ContenidoRepositorio {
  let catalogoCache: Promise<readonly ItemCatalogo[]> | null = null;
  const materiasCache = new Map<MateriaId, Promise<Materia>>();

  async function cargarCatalogo(): Promise<readonly ItemCatalogo[]> {
    if (cargadores.catalogo === null) {
      throw new ErrorContenido('Falta generar el contenido: npm run content:build');
    }
    const crudo = await cargadores.catalogo();
    const r = CatalogoSchema.safeParse(crudo);
    if (!r.success) {
      throw new ErrorContenido(`Catalogo invalido: ${describirIssues(r.error)}`);
    }
    // Chequeo en compilacion: el esquema debe ser compatible con el dominio.
    return r.data satisfies readonly ItemCatalogo[];
  }

  async function cargarMateria(id: MateriaId, cargador: Cargador): Promise<Materia> {
    const crudo = await cargador();
    const r = MateriaSchema.safeParse(crudo);
    if (!r.success) {
      throw new ErrorContenido(`Materia "${id}" invalida: ${describirIssues(r.error)}`);
    }
    if (r.data.id !== id) {
      throw new ErrorContenido(`Materia "${id}" invalida: id: el contenido declara "${r.data.id}"`);
    }
    return r.data satisfies Materia;
  }

  return {
    catalogo() {
      if (catalogoCache === null) {
        const promesa = cargarCatalogo();
        catalogoCache = promesa;
        // Un rechazo no se cachea: el siguiente intento reintenta.
        promesa.catch(() => {
          if (catalogoCache === promesa) catalogoCache = null;
        });
      }
      return catalogoCache;
    },
    async materia(id) {
      const cargador = Object.hasOwn(cargadores.materias, id) ? cargadores.materias[id] : undefined;
      if (cargador === undefined) return null;
      let promesa = materiasCache.get(id);
      if (promesa === undefined) {
        const nueva = cargarMateria(id, cargador);
        promesa = nueva;
        materiasCache.set(id, nueva);
        nueva.catch(() => {
          if (materiasCache.get(id) === nueva) materiasCache.delete(id);
        });
      }
      return promesa;
    },
  };
}
