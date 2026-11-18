import { forwardRef } from 'react';
import type { Marca, Pregunta } from '../../domain/types';
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
  alVoltear(): void;
  alMarcar(m: Marca): void;
  alOtra(): void;
  alGirarDeNuevo(): void;
}

export const ColumnaTarjeta = forwardRef<HTMLElement, ColumnaTarjetaProps>(function ColumnaTarjeta(
  { contenido, ocupado, alVoltear, alMarcar, alOtra, alGirarDeNuevo },
  ref,
) {
  return (
    <section ref={ref} className={estilos.der} aria-live="polite" aria-busy={ocupado || undefined}>
      {contenido.tipo === 'tarjeta' ? (
        <>
          <p className={estilos.resultado}>Salió {contenido.tema.nombre}</p>
          <Tarjeta
            tema={contenido.tema}
            pregunta={contenido.pregunta}
            dada={contenido.dada}
            repaso={contenido.repaso}
            alVoltear={alVoltear}
          />
          <Acciones
            marcarVisible={contenido.marcarVisible}
            marca={contenido.marca}
            alMarcar={alMarcar}
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
