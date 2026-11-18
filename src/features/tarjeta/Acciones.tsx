import type { Marca } from '../../domain/types';
import { Boton } from '../../shared/ui';
import estilos from './Acciones.module.css';

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
      <Boton onClick={alOtra}>Otra de este tema</Boton>
      <Boton onClick={alGirarDeNuevo}>Girar de nuevo</Boton>
    </div>
  );
}
