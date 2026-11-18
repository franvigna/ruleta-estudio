import type { ReactNode } from 'react';
import type { Conteo, EstadisticaTema } from '../../domain/estadisticas';
import type { Progreso } from '../../domain/types';
import { BotonReiniciar } from './BotonReiniciar';
import { CatalogoPreguntas } from './CatalogoPreguntas';
import estilos from './PanelProgreso.module.css';
import { Resumen } from './Resumen';

export interface PanelProgresoProps {
  resumen: Conteo;
  porTema: readonly EstadisticaTema[];
  progreso: Progreso;
  alReiniciar(): void;
  aviso?: ReactNode;
}

export function PanelProgreso({
  resumen,
  porTema,
  progreso,
  alReiniciar,
  aviso,
}: PanelProgresoProps) {
  return (
    <>
      <Resumen resumen={resumen} />
      <section className={estilos.panel}>
        <CatalogoPreguntas porTema={porTema} progreso={progreso} />
      </section>
      <div className={estilos.pie}>
        <BotonReiniciar alConfirmar={alReiniciar} />
        {aviso ? <div className={estilos.aviso}>{aviso}</div> : null}
      </div>
    </>
  );
}
