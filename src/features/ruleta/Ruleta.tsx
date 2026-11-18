import type { KeyboardEvent } from 'react';
import {
  etiquetaSegmento,
  pathSegmento,
  tonosSegmentos,
  type PlanGiro,
} from '../../domain/ruleta-math';
import { varArea } from '../../shared/ui';
import type { Animador } from './animador';
import { Puntero } from './Puntero';
import estilos from './Ruleta.module.css';
import { useGiro } from './useGiro';

export interface RuletaProps {
  temas: readonly { id: string; etiquetaCorta: string; area: string }[];
  disponibles: ReadonlySet<string>;
  rot: number;
  giro: PlanGiro | null;
  ganador: number | null;
  animador: Animador;
  alGirar(): void;
  alTic(): void;
  alTerminar(): void;
  etiquetaAria: string;
}

export function Ruleta({
  temas,
  disponibles,
  rot,
  giro,
  ganador,
  animador,
  alGirar,
  alTic,
  alTerminar,
  etiquetaAria,
}: RuletaProps) {
  const n = temas.length;
  const { refGrupo, tics } = useGiro({ giro, n, animador, alTic, alTerminar });
  const tonos = tonosSegmentos(temas);

  const alTeclear = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      alGirar();
    }
  };

  // El ganador va al final del orden de dibujo para quedar encima.
  const orden = temas.map((_, i) => i).filter((i) => i !== ganador);
  if (ganador !== null && ganador >= 0 && ganador < n) orden.push(ganador);

  return (
    <div className={estilos.ruedaBox}>
      <Puntero key={tics} tic={tics > 0} />
      <svg className={estilos.rueda} viewBox="-10 -10 420 420" role="img" aria-label={etiquetaAria}>
        <circle cx="200" cy="200" r="198" fill="var(--tinta)" />
        <g ref={refGrupo} transform={`rotate(${rot} 200 200)`}>
          {orden.map((i) => {
            const t = temas[i];
            if (!t) return null;
            const et = etiquetaSegmento(i, n);
            const clases = [
              estilos.seg,
              disponibles.has(t.id) ? '' : estilos.completo,
              i === ganador ? estilos.gana : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <g key={t.id} className={clases} data-indice={i}>
                <path
                  d={pathSegmento(i, n)}
                  style={{ fill: varArea(t.area, tonos[i] === 'suave') }}
                />
                <text transform={et.transform} x={et.x} y={et.y} textAnchor={et.anchor}>
                  {t.etiquetaCorta}
                </text>
              </g>
            );
          })}
        </g>
        <g
          className={estilos.centro}
          role="button"
          tabIndex={0}
          aria-label="Girar la ruleta"
          onClick={alGirar}
          onKeyDown={alTeclear}
        >
          <circle
            cx="200"
            cy="200"
            r="34"
            fill="var(--tinta)"
            stroke="var(--blanco)"
            strokeWidth="3"
          />
          <text x="200" y="205" textAnchor="middle">
            Girar
          </text>
        </g>
      </svg>
      {ganador !== null ? (
        <div className={estilos.celebracion} key={ganador} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}
    </div>
  );
}
