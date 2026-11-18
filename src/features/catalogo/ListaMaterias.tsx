import type { ReactNode } from 'react';
import estilos from './ListaMaterias.module.css';
import { TarjetaMateria, type ItemConAvance } from './TarjetaMateria';

export interface ListaMateriasProps {
  items: readonly ItemConAvance[];
  /** Lo pone quien nos llama (el <Link> del router): la feature no conoce el router. */
  renderEnlace(materiaId: string, contenido: ReactNode, className?: string): ReactNode;
}

export function ListaMaterias({ items, renderEnlace }: ListaMateriasProps) {
  if (items.length === 0) {
    return <p className={estilos.vacio}>Todavía no hay materias. Ejecutá npm run content:build.</p>;
  }
  return (
    <ul className={estilos.lista}>
      {items.map((item) => (
        <li key={item.id}>
          <TarjetaMateria item={item} renderEnlace={renderEnlace} />
        </li>
      ))}
    </ul>
  );
}
