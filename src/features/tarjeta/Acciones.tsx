import type { Marca } from '../../domain/types';
import { Boton } from '../../shared/ui';
import estilos from './Acciones.module.css';

function IconoSiguiente() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h12M13 7l5 5-5 5" />
    </svg>
  );
}

function IconoGirar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.4 8A7 7 0 1 0 19 15M18 4v5h-5" />
    </svg>
  );
}

export interface AccionesProps {
  marcarVisible: boolean;
  marca: Marca | undefined;
  alMarcar(m: Marca): void;
  alOtra(): void;
  alGirarDeNuevo(): void;
}

function textoEstado(marca: Marca | undefined): string {
  if (marca === 'si') return 'Sale de la ruleta.';
  if (marca === 'no') return 'Queda para repasar.';
  return '';
}

export function Acciones({
  marcarVisible,
  marca,
  alMarcar,
  alOtra,
  alGirarDeNuevo,
}: AccionesProps) {
  return (
    <div className={estilos.acciones}>
      {marcarVisible ? (
        <div className={estilos.marcar}>
          <span className={estilos.q}>¿Te la sabías?</span>
          <Boton tono="si" aria-pressed={marca === 'si'} onClick={() => alMarcar('si')}>
            Me la sabía
          </Boton>
          <Boton tono="no" aria-pressed={marca === 'no'} onClick={() => alMarcar('no')}>
            No me la sabía
          </Boton>
          <span className={estilos.estado}>{textoEstado(marca)}</span>
        </div>
      ) : null}
      <Boton
        className={estilos.icono}
        aria-label="Siguiente pregunta del mismo tema"
        title="Siguiente pregunta del mismo tema"
        onClick={alOtra}
      >
        <IconoSiguiente />
      </Boton>
      <Boton
        className={estilos.icono}
        aria-label="Volver a girar la ruleta"
        title="Volver a girar la ruleta"
        onClick={alGirarDeNuevo}
      >
        <IconoGirar />
      </Boton>
    </div>
  );
}
