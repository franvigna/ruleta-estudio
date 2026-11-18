import { HashRouter } from 'react-router-dom';
import type { MateriaId } from '../domain/types';

/** Unico lugar de la decision Hash/Browser (pasar a BrowserRouter es una linea, fase 6). */
export const Router = HashRouter;

export function hrefMateria(id: MateriaId): string {
  return `/materia/${encodeURIComponent(id)}`;
}

export function hrefProgreso(id: MateriaId): string {
  return `${hrefMateria(id)}/progreso`;
}

export const HREF_CATALOGO = '/';
