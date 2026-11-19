import { forwardRef } from 'react';
import type { Marca, Pregunta } from '../../domain/types';
import { Boton } from '../../shared/ui';
import { Acciones } from './Acciones';
import estilos from './ColumnaTarjeta.module.css';
import { EstadoVacio } from './EstadoVacio';
import { Tarjeta } from './Tarjeta';

export type ContenidoColumna =
  | { tipo: 'vacio' }
  | { tipo: 'todo-sabido' }
  | {
      tipo: 'tarjeta';
      tema: { nombre: string; area: string };
      pregunta: Pregunta;
      dada: boolean;
      marcarVisible: boolean;
      repaso: boolean;
      marca: Marca | undefined;
    };

export interface ColumnaTarjetaProps {
  contenido: ContenidoColumna;
  ocupado: boolean;
  posicion: { actual: number; total: number };
  alCerrar(): void;
  alVoltear(): void;
  alMarcar(m: Marca): void;
  alAnterior(): void;
  alOtra(): void;
  alGirarDeNuevo(): void;
}

export const ColumnaTarjeta = forwardRef<HTMLElement, ColumnaTarjetaProps>(function ColumnaTarjeta(
  {
    contenido,
    ocupado,
    posicion,
    alCerrar,
    alVoltear,
    alMarcar,
    alAnterior,
    alOtra,
    alGirarDeNuevo,
  },
  ref,
) {
  const esTarjeta = contenido.tipo === 'tarjeta';
  return (
    <section
      ref={ref}
      className={estilos.der}
      aria-live="polite"
      aria-busy={ocupado || undefined}
      aria-label={esTarjeta ? `Pregunta de ${contenido.tema.nombre}` : undefined}
      aria-modal={esTarjeta || undefined}
      role={esTarjeta ? 'dialog' : undefined}
      tabIndex={esTarjeta ? -1 : undefined}
    >
      {esTarjeta ? (
        <>
          <div className={estilos.encabezado}>
            <p className={estilos.resultado}>Salió {contenido.tema.nombre}</p>
            <Boton
              className={estilos.cerrar}
              aria-label="Cerrar tarjeta y volver a la ruleta"
              title="Cerrar tarjeta y volver a la ruleta"
              onClick={alCerrar}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </Boton>
          </div>
          <Tarjeta
            tema={contenido.tema}
            pregunta={contenido.pregunta}
            dada={contenido.dada}
            repaso={contenido.repaso}
            marca={contenido.marca}
            alVoltear={alVoltear}
          />
          <Acciones
            marcarVisible={contenido.marcarVisible}
            marca={contenido.marca}
            posicion={posicion}
            alMarcar={alMarcar}
            alAnterior={alAnterior}
            alOtra={alOtra}
            alGirarDeNuevo={alGirarDeNuevo}
          />
        </>
      ) : (
        <EstadoVacio todoSabido={contenido.tipo === 'todo-sabido'} />
      )}
    </section>
  );
});
