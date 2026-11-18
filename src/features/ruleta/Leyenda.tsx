import type { CSSProperties } from 'react';
import { varArea } from '../../shared/ui';
import estilos from './Ruleta.module.css';

export function Leyenda({ areas }: { areas: readonly { id: string; nombre: string }[] }) {
  return (
    <div className={estilos.leyenda} aria-label="Áreas">
      {areas.map((a) => (
        <span key={a.id} style={{ '--c': varArea(a.id) } as CSSProperties}>
          {a.id} {a.nombre}
        </span>
      ))}
    </div>
  );
}
