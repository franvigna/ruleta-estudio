import estilos from './AvisoGuardado.module.css';

export const TEXTO_AVISO_GUARDADO =
  'Este navegador no permite guardar: el progreso se pierde al cerrar la página.';

/** Aviso de que el progreso no se esta guardando. */
export function AvisoGuardado({ texto = TEXTO_AVISO_GUARDADO }: { texto?: string }) {
  return (
    <p className={estilos.aviso} role="status">
      {texto}
    </p>
  );
}
