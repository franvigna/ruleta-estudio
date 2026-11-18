import { Kbd } from '../../shared/ui';
import estilos from './AyudaAtajos.module.css';

export function AyudaAtajos() {
  return (
    <div className={estilos.teclas} aria-hidden="true">
      <span>
        <Kbd>Espacio</Kbd> o <Kbd>Enter</Kbd> girar
      </span>
      <span>
        <Kbd>V</Kbd> dar vuelta
      </span>
      <span>
        <Kbd>S</Kbd> / <Kbd>N</Kbd> me la sabía / no
      </span>
    </div>
  );
}
