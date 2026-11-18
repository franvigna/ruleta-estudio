import { useEffect, useRef, useState } from 'react';
import { Boton, Kbd } from '../../shared/ui';
import estilos from './AyudaAtajos.module.css';

export function AyudaAtajos() {
  const [abierta, setAbierta] = useState(false);
  const refCerrar = useRef<HTMLButtonElement>(null);
  const refAbrir = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierta) return;
    const abrir = refAbrir.current;
    refCerrar.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(false);
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      abrir?.focus();
    };
  }, [abierta]);

  return (
    <>
      <Boton
        ref={refAbrir}
        className={estilos.abrir}
        aria-haspopup="dialog"
        onClick={() => setAbierta(true)}
      >
        Shortcuts
      </Boton>
      {abierta ? (
        <div className={estilos.fondo}>
          <button
            type="button"
            className={estilos.cortina}
            tabIndex={-1}
            aria-label="Cerrar shortcuts"
            onClick={() => setAbierta(false)}
          />
          <div
            className={estilos.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-atajos"
          >
            <h2 id="titulo-atajos">Shortcuts</h2>
            <ul className={estilos.lista}>
              <li>
                <Kbd>Espacio</Kbd> o <Kbd>Enter</Kbd> girar
              </li>
              <li>
                <Kbd>V</Kbd> dar vuelta
              </li>
              <li>
                <Kbd>S</Kbd> / <Kbd>N</Kbd> me la sabía / no
              </li>
            </ul>
            <Boton ref={refCerrar} onClick={() => setAbierta(false)}>
              Cerrar
            </Boton>
          </div>
        </div>
      ) : null}
    </>
  );
}
