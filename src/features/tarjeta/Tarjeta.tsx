import type { CSSProperties, KeyboardEvent } from 'react';
import type { Marca, Pregunta } from '../../domain/types';
import { Chip, Insignia, varArea } from '../../shared/ui';
import estilos from './Tarjeta.module.css';

export interface TarjetaProps {
  tema: { nombre: string; area: string };
  pregunta: Pregunta;
  dada: boolean;
  repaso: boolean;
  marca?: Marca;
  alVoltear(): void;
}

export function Tarjeta({ tema, pregunta, dada, repaso, marca, alVoltear }: TarjetaProps) {
  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      alVoltear();
    }
  };

  return (
    <div className={estilos.escena}>
      <div
        className={[
          estilos.tarjeta,
          dada ? estilos.dada : '',
          marca === 'si' ? estilos.sabida : '',
          marca === 'no' ? estilos.noSabida : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-marca={marca}
        role="button"
        tabIndex={0}
        aria-pressed={dada}
        aria-label={
          dada
            ? 'Tarjeta: mostrando la respuesta, tocá para volver'
            : 'Tarjeta: tocá para ver la respuesta'
        }
        style={{ '--area': varArea(tema.area) } as CSSProperties}
        onClick={alVoltear}
        onKeyDown={alTeclear}
      >
        <div
          className={`${estilos.cara} ${estilos.frente}`}
          aria-hidden={dada}
          data-testid="cara-frente"
        >
          <div className={estilos.franja} />
          <div className={estilos.cabeza}>
            <Chip>{tema.nombre}</Chip>
            {pregunta.etiqueta ? <Insignia>{pregunta.etiqueta}</Insignia> : null}
            {repaso ? <Insignia tono="repaso">Para repasar</Insignia> : null}
          </div>
          <div className={estilos.cuerpo}>
            <div
              className={estilos.pregunta}
              dangerouslySetInnerHTML={{ __html: pregunta.enunciado }}
            />
          </div>
          <div className={estilos.pie}>Tocá la tarjeta para ver la respuesta</div>
        </div>
        <div
          className={`${estilos.cara} ${estilos.dorso}`}
          aria-hidden={!dada}
          data-testid="cara-dorso"
        >
          <div className={estilos.franja} />
          <div className={estilos.cabeza}>
            <Chip>{tema.nombre}</Chip>
            <Chip variante="contorno">Respuesta</Chip>
          </div>
          <div className={`${estilos.cuerpo} ${estilos.respuesta}`}>
            {pregunta.nota ? <p className={estilos.nota}>{pregunta.nota}</p> : null}
            <div dangerouslySetInnerHTML={{ __html: pregunta.respuesta }} />
          </div>
          <div className={estilos.pie}>Tocá la tarjeta para volver a la pregunta</div>
        </div>
      </div>
    </div>
  );
}
