import { z } from 'zod';

/**
 * Esquemas del contenido. Los comparten los scripts de build (Node) y la carga
 * en el navegador (infra/contenido-repo). Solo depende de zod.
 *
 * Hay dos formas:
 *  - "Fuente": lo que se escribe a mano en content/materias/<id>/materia.json.
 *  - "Generada": lo que produce scripts/build-content.ts en src/content/generated/.
 */

const idKebab = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'debe ser kebab-case: minusculas, numeros y guiones');

const idArea = z.string().regex(/^[A-Za-z0-9_-]+$/, 'solo letras, numeros, guion y guion bajo');

const colorHex = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'debe ser un color #RRGGBB');

const textoNoVacio = z.string().min(1, 'no puede estar vacio');

export const TIPOS_PREGUNTA = ['teorica', 'reflexion', 'votacion'] as const;
export const TipoPreguntaSchema = z.enum(TIPOS_PREGUNTA);

// ---------------------------------------------------------------- Fuente

export const AreaSchema = z
  .object({
    id: idArea,
    nombre: textoNoVacio,
    color: colorHex,
    colorSuave: colorHex,
  })
  .strict();

export const TemaFuenteSchema = z
  .object({
    id: idKebab,
    nombre: textoNoVacio,
    etiquetaCorta: textoNoVacio,
    area: idArea,
    /** Nombre del archivo dentro de temas/, por ejemplo "cc-fundamentos.md". */
    archivo: z.string().regex(/^[^/\\]+\.md$/, 'debe ser un nombre de archivo .md dentro de temas/'),
  })
  .strict();

export const MateriaFuenteSchema = z
  .object({
    id: idKebab,
    nombre: textoNoVacio,
    descripcion: textoNoVacio,
    /** Marca la materia como ejemplo en el catalogo. */
    ejemplo: z.boolean().optional(),
    areas: z.array(AreaSchema).min(1),
    /** En el orden en que aparecen en la ruleta. */
    temas: z.array(TemaFuenteSchema).min(1),
  })
  .strict();

// ------------------------------------------------------------- Generada

export const PreguntaSchema = z
  .object({
    id: z.string().regex(/^[^\s|]+$/, 'sin espacios ni "|"'),
    tipo: TipoPreguntaSchema,
    /** HTML ya renderizado en el build. Para votaciones incluye la lista de opciones. */
    enunciado: textoNoVacio,
    /** HTML ya renderizado en el build. */
    respuesta: textoNoVacio,
    /** Texto plano, por ejemplo "Tomada en parciales". */
    etiqueta: textoNoVacio.optional(),
    /** Texto plano: aviso de "respuesta armada con la teoria". */
    nota: textoNoVacio.optional(),
  })
  .strict();

export const TemaSchema = z
  .object({
    id: idKebab,
    nombre: textoNoVacio,
    etiquetaCorta: textoNoVacio,
    area: idArea,
    preguntas: z.array(PreguntaSchema).min(1),
  })
  .strict();

export const MateriaSchema = z
  .object({
    id: idKebab,
    nombre: textoNoVacio,
    descripcion: textoNoVacio,
    ejemplo: z.boolean().optional(),
    areas: z.array(AreaSchema).min(1),
    temas: z.array(TemaSchema).min(1),
  })
  .strict();

export const CatalogoItemSchema = z
  .object({
    id: idKebab,
    nombre: textoNoVacio,
    descripcion: textoNoVacio,
    ejemplo: z.boolean().optional(),
    cantidadTemas: z.number().int().positive(),
    cantidadPreguntas: z.number().int().positive(),
  })
  .strict();

export const CatalogoSchema = z.array(CatalogoItemSchema);

export type TipoPreguntaContenido = z.infer<typeof TipoPreguntaSchema>;
export type AreaContenido = z.infer<typeof AreaSchema>;
export type MateriaFuente = z.infer<typeof MateriaFuenteSchema>;
export type PreguntaContenido = z.infer<typeof PreguntaSchema>;
export type TemaContenido = z.infer<typeof TemaSchema>;
export type MateriaContenido = z.infer<typeof MateriaSchema>;
export type CatalogoItem = z.infer<typeof CatalogoItemSchema>;
