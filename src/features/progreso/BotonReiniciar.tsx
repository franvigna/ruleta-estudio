import { useEffect, useRef, useState } from 'react';
import { Boton } from '../../shared/ui';
import estilos from './BotonReiniciar.module.css';

export interface BotonReiniciarProps {
  alConfirmar(): void;
  /** Tiempo que el boton queda armado esperando el segundo toque. */
  msArmado?: number;
}

export function BotonReiniciar({ alConfirmar, msArmado = 4000 }: BotonReiniciarProps) {
  const [armado, setArmado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const limpiar = () => {
    if (temporizador.current !== null) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }
  };

  useEffect(() => limpiar, []);

  const alClic = () => {
    if (!armado) {
      setArmado(true);
      limpiar();
      temporizador.current = setTimeout(() => {
        temporizador.current = null;
        setArmado(false);
      }, msArmado);
      return;
    }
    limpiar();
    setArmado(false);
    alConfirmar();
  };

  return (
    <Boton className={estilos.reset} armado={armado} onClick={alClic}>
      {armado ? '¿Seguro? Tocá de nuevo para borrar todo' : 'Reiniciar progreso'}
    </Boton>
  );
}
