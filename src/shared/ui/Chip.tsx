import type { ReactNode } from 'react';
import estilos from './Chip.module.css';

export interface ChipProps {
  /** 'area' pinta con var(--area) (lo define el contenedor); 'contorno' es el rotulo "Respuesta". */
  variante?: 'area' | 'contorno';
  children: ReactNode;
}

export function Chip({ variante = 'area', children }: ChipProps) {
  return <span className={variante === 'area' ? estilos.chip : estilos.contorno}>{children}</span>;
}

export interface InsigniaProps {
  tono?: 'normal' | 'repaso';
  children: ReactNode;
}

/** Etiqueta chica: "Tomada en parciales", "Para repasar", etc. */
export function Insignia({ tono = 'normal', children }: InsigniaProps) {
  return (
    <span
      className={tono === 'repaso' ? `${estilos.insignia} ${estilos.repaso}` : estilos.insignia}
    >
      {children}
    </span>
  );
}
