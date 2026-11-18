import type { CSSProperties } from 'react';
import type { EstadisticaTema } from '../../domain/estadisticas';
import { varArea } from '../../shared/ui';
import estilos from './BarraTema.module.css';

export function BarraTema({ estadistica }: { estadistica: EstadisticaTema }) {
  const { tema, si, no, sin, total, pct } = estadistica;
  const ancho = (n: number) => (total === 0 ? 0 : (100 * n) / total);
  return (
    <div className={estilos.fila} style={{ '--c': varArea(tema.area) } as CSSProperties}>
      <span className={estilos.nom}>{tema.nombre}</span>
      <div
        className={estilos.barra}
        role="img"
        aria-label={`${si} sabidas, ${no} no sabidas, ${sin} sin responder`}
      >
        <span className={estilos.si} style={{ width: `${ancho(si)}%` }} />
        <span className={estilos.no} style={{ width: `${ancho(no)}%` }} />
      </div>
      <span className={estilos.num}>
        <b>{pct}%</b> {si} de {total}
      </span>
    </div>
  );
}
