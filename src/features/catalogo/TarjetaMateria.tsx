import type { ReactNode } from 'react';
import type { ItemCatalogo } from '../../domain/types';
import { Insignia } from '../../shared/ui';
import estilos from './TarjetaMateria.module.css';

export type ItemConAvance = ItemCatalogo & { pct: number };

export interface TarjetaMateriaProps {
  item: ItemConAvance;
  renderEnlace(materiaId: string, contenido: ReactNode, className?: string): ReactNode;
}

export function TarjetaMateria({ item, renderEnlace }: TarjetaMateriaProps) {
  return renderEnlace(
    item.id,
    <>
      <span className={estilos.cabeza}>
        <span className={estilos.nombre}>{item.nombre}</span>
        {item.ejemplo ? <Insignia>Ejemplo</Insignia> : null}
      </span>
      <span className={estilos.descripcion}>{item.descripcion}</span>
      <span className={estilos.meta}>
        {item.cantidadTemas} temas · {item.cantidadPreguntas} preguntas
      </span>
      <span className={estilos.avance}>
        <span className={estilos.barra} aria-hidden="true">
          <span className={estilos.relleno} style={{ width: `${item.pct}%` }} />
        </span>
        <span>{item.pct}% sabido</span>
      </span>
    </>,
    estilos.tarjeta,
  );
}
