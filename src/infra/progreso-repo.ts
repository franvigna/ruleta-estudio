import type { MateriaId, Progreso } from '../domain/types';

export interface ProgresoRepositorio {
  cargar(materiaId: MateriaId): Promise<Progreso>;
  /** Rechaza con ErrorAlmacenamiento si no pudo persistir. */
  guardar(materiaId: MateriaId, p: Progreso): Promise<void>;
  reiniciar(materiaId: MateriaId): Promise<void>;
}

export class ErrorAlmacenamiento extends Error {
  constructor(mensaje: string, opciones?: { cause?: unknown }) {
    super(mensaje, opciones);
    this.name = 'ErrorAlmacenamiento';
  }
}

/** Subconjunto de Storage, inyectable. */
export interface AlmacenClaveValor {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}
