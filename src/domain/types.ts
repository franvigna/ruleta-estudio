/**
 * Tipos del dominio. Estructuralmente compatibles con los esquemas de
 * src/content/schema.ts (domain/ no puede importar de content/).
 */

export type MateriaId = string;
export type TemaId = string;
export type PreguntaId = string;
export type AreaId = string;

export type TipoPregunta = 'teorica' | 'reflexion' | 'votacion';
export type Marca = 'si' | 'no';

export interface Area {
  readonly id: AreaId;
  readonly nombre: string;
  readonly color: string;
  readonly colorSuave: string;
}

export interface Pregunta {
  readonly id: PreguntaId;
  readonly tipo: TipoPregunta;
  /** HTML ya renderizado en el build. Para votaciones incluye las opciones. */
  readonly enunciado: string;
  /** HTML ya renderizado en el build. */
  readonly respuesta: string;
  readonly etiqueta?: string;
  readonly nota?: string;
}

export interface Tema {
  readonly id: TemaId;
  readonly nombre: string;
  readonly etiquetaCorta: string;
  readonly area: AreaId;
  readonly preguntas: readonly Pregunta[];
}

export interface Materia {
  readonly id: MateriaId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly ejemplo?: boolean;
  readonly areas: readonly Area[];
  readonly temas: readonly Tema[];
}

/** Item liviano del catalogo de materias. */
export interface ItemCatalogo {
  readonly id: MateriaId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly ejemplo?: boolean;
  readonly cantidadTemas: number;
  readonly cantidadPreguntas: number;
}

/**
 * Progreso de una materia. Es un objeto y no un Record suelto para que una
 * estrategia futura (repeticion espaciada) pueda sumar campos sin romper nada.
 */
export interface Progreso {
  readonly marcas: Readonly<Record<PreguntaId, Marca>>;
}
