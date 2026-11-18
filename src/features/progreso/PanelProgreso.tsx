import type { ReactNode } from 'react';
import type {
  Conteo,
  EstadisticaTema,
  PreguntaDificil,
  TemaAReforzar,
} from '../../domain/estadisticas';
import { BarraTema } from './BarraTema';
import { BotonReiniciar } from './BotonReiniciar';
import estilos from './PanelProgreso.module.css';
import { Resumen } from './Resumen';
import { PreguntasDificiles } from './PreguntasDificiles';
import { TemasAReforzar } from './TemasAReforzar';

export interface PanelProgresoProps {
  resumen: Conteo;
  reforzar: readonly TemaAReforzar[];
  porTema: readonly EstadisticaTema[];
  preguntasDificiles: readonly PreguntaDificil[];
  alReiniciar(): void;
  aviso?: ReactNode;
}

export function PanelProgreso({
  resumen,
  reforzar,
  porTema,
  preguntasDificiles,
  alReiniciar,
  aviso,
}: PanelProgresoProps) {
  return (
    <>
      <Resumen resumen={resumen} />
      <div className={estilos.dos}>
        <div className={estilos.panel}>
          <h3>Temas para reforzar</h3>
          <TemasAReforzar temas={reforzar} />
          <BotonReiniciar alConfirmar={alReiniciar} />
          {aviso ? <div className={estilos.aviso}>{aviso}</div> : null}
        </div>
        <div className={estilos.panel}>
          <h3>Por tema</h3>
          <div className={estilos.leyenda}>
            <span>
              <i className={estilos.leySi} />
              Sabidas (color del área)
            </span>
            <span>
              <i className={estilos.leyNo} />
              No sabidas
            </span>
            <span>
              <i className={estilos.leySin} />
              Sin responder
            </span>
          </div>
          <div>
            {porTema.map((e) => (
              <BarraTema key={e.tema.id} estadistica={e} />
            ))}
          </div>
        </div>
      </div>
      <section className={`${estilos.panel} ${estilos.dificiles}`}>
        <h3>Preguntas que más te costaron</h3>
        <p className={estilos.explicacion}>
          Se ordenan por la cantidad de veces que las marcaste como no sabidas.
        </p>
        <PreguntasDificiles preguntas={preguntasDificiles} />
      </section>
    </>
  );
}
