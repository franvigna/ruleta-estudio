import type { ButtonHTMLAttributes } from 'react';
import estilos from './Boton.module.css';

export interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Con aria-pressed="true" el tono 'si' pinta verde y 'no' pinta rosa. */
  tono?: 'neutro' | 'si' | 'no';
  /** Estado de confirmacion pendiente (por ejemplo, "¿Seguro?"). */
  armado?: boolean;
}

export function Boton({
  tono = 'neutro',
  armado = false,
  className,
  type = 'button',
  ...resto
}: BotonProps) {
  const clases = [
    estilos.boton,
    tono === 'si' ? estilos.si : '',
    tono === 'no' ? estilos.no : '',
    armado ? estilos.armado : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={clases} {...resto} />;
}
