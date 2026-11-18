import estilos from './Ruleta.module.css';

/** Puntero fijo arriba de la rueda. Remontarlo (key) reinicia la animacion del tic. */
export function Puntero({ tic }: { tic: boolean }) {
  return (
    <svg
      className={tic ? `${estilos.puntero} ${estilos.tic}` : estilos.puntero}
      viewBox="0 0 34 44"
      aria-hidden="true"
    >
      <path d="M17 42 L3 8 Q17 -2 31 8 Z" fill="var(--tinta)" />
      <circle cx="17" cy="11" r="4" fill="var(--blanco)" />
    </svg>
  );
}
