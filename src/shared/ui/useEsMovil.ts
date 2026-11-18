import { useSyncExternalStore } from 'react';

const CONSULTA = '(max-width: 860px)';

function suscribir(avisar: () => void): () => void {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener('change', avisar);
  return () => mq.removeEventListener('change', avisar);
}

function leer(): boolean {
  return window.matchMedia(CONSULTA).matches;
}

/** true cuando el viewport es de 860 px o menos (layout de una columna). */
export function useEsMovil(): boolean {
  return useSyncExternalStore(suscribir, leer, () => false);
}
