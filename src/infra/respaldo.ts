import { z } from 'zod';
import type { MateriaId, Progreso } from '../domain/types';
import { progresoDeEntrada } from './local-storage-repo';

const FORMATO = 'ruleta-estudio-respaldo';
const VERSION = 1;
/** Un respaldo real pesa unos pocos KB; esto corta archivos equivocados. */
const MAX_CARACTERES = 1_000_000;

const RespaldoSchema = z.object({
  formato: z.literal(FORMATO),
  version: z.literal(VERSION),
  materiaId: z.string().min(1),
  progreso: z.object({
    marcas: z.record(z.string(), z.unknown()),
    fallos: z.record(z.string(), z.unknown()).optional(),
  }),
});

export class ErrorRespaldo extends Error {
  constructor(mensaje: string, opciones?: { cause?: unknown }) {
    super(mensaje, opciones);
    this.name = 'ErrorRespaldo';
  }
}

/** Texto (JSON en una linea) para guardar en un archivo o copiar como codigo. */
export function crearRespaldo(materiaId: MateriaId, progreso: Progreso): string {
  return JSON.stringify({
    formato: FORMATO,
    version: VERSION,
    materiaId,
    progreso: {
      marcas: progreso.marcas,
      ...(progreso.fallos ? { fallos: progreso.fallos } : {}),
    },
  });
}

/** Valida un respaldo externo. Lanza ErrorRespaldo con un mensaje apto para mostrar. */
export function leerRespaldo(texto: string): { materiaId: MateriaId; progreso: Progreso } {
  const limpio = texto.trim();
  if (limpio === '') throw new ErrorRespaldo('No hay nada para importar.');
  if (limpio.length > MAX_CARACTERES) throw new ErrorRespaldo('El archivo es demasiado grande.');
  let crudo: unknown;
  try {
    crudo = JSON.parse(limpio);
  } catch (causa) {
    throw new ErrorRespaldo('El contenido no es un respaldo válido.', { cause: causa });
  }
  const r = RespaldoSchema.safeParse(crudo);
  if (!r.success) {
    throw new ErrorRespaldo('El contenido no es un respaldo de Ruleta de Estudio.');
  }
  return { materiaId: r.data.materiaId, progreso: progresoDeEntrada(r.data.progreso) };
}
