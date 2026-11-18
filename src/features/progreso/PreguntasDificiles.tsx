import type { PreguntaDificil } from '../../domain/estadisticas';
import estilos from './PreguntasDificiles.module.css';

export function PreguntasDificiles({ preguntas }: { preguntas: readonly PreguntaDificil[] }) {
  if (preguntas.length === 0) {
    return <p className={estilos.vacio}>Todavía no hay preguntas marcadas como no sabidas.</p>;
  }
  return (
    <ol className={estilos.lista}>
      {preguntas.map((item) => (
        <li key={item.pregunta.id}>
          <div className={estilos.texto}>
            <span className={estilos.tema}>{item.tema.nombre}</span>
            <div dangerouslySetInnerHTML={{ __html: item.pregunta.enunciado }} />
          </div>
          <strong className={estilos.fallos}>
            {item.fallos} {item.fallos === 1 ? 'fallo' : 'fallos'}
          </strong>
        </li>
      ))}
    </ol>
  );
}
