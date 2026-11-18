import { useEffect, useRef } from 'react';
import type { Marca } from '../../domain/types';

export interface AccionesAtajos {
  girar(): void;
  voltear(): void;
  marcar(m: Marca): void;
}

/** Atajos globales de teclado. Espacio/Enter no actuan si el foco esta en un boton o link. */
export function useAtajosTeclado(
  acciones: AccionesAtajos,
  objetivo: Pick<Document, 'addEventListener' | 'removeEventListener'> = document,
): void {
  const ref = useRef(acciones);
  useEffect(() => {
    ref.current = acciones;
  });

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const a = ref.current;
      if (e.key === ' ' || e.key === 'Enter') {
        if ((e.target as Element | null)?.closest?.('button, a')) return;
        e.preventDefault();
        a.girar();
      } else if (e.key === 'v' || e.key === 'V') a.voltear();
      else if (e.key === 's' || e.key === 'S') a.marcar('si');
      else if (e.key === 'n' || e.key === 'N') a.marcar('no');
    };
    objetivo.addEventListener('keydown', alTeclear);
    return () => objetivo.removeEventListener('keydown', alTeclear);
  }, [objetivo]);
}
