import { useEffect, useState } from 'react';
import estilos from './BotonTema.module.css';

type TemaVisual = 'claro' | 'oscuro';

function IconoTema({ tema }: { tema: TemaVisual }) {
  if (tema === 'claro') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function BotonTema({ className }: { className?: string } = {}) {
  const [tema, setTema] = useState<TemaVisual>('claro');
  const temaSiguiente: TemaVisual = tema === 'claro' ? 'oscuro' : 'claro';
  const etiqueta = `Activar tema ${temaSiguiente}`;

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    return () => {
      delete document.documentElement.dataset.tema;
    };
  }, [tema]);

  return (
    <button
      type="button"
      className={[estilos.boton, className].filter(Boolean).join(' ')}
      aria-label={etiqueta}
      aria-pressed={tema === 'oscuro'}
      title={etiqueta}
      onClick={() => setTema(temaSiguiente)}
    >
      <IconoTema tema={tema} />
      <span>Tema {temaSiguiente}</span>
    </button>
  );
}
