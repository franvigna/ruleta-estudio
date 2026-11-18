import type { TemaAReforzar } from '../../domain/estadisticas';
import estilos from './TemasAReforzar.module.css';

export function TemasAReforzar({ temas }: { temas: readonly TemaAReforzar[] }) {
  if (temas.length === 0) {
    return (
      <p className={estilos.vacio}>
        Todavía no marcaste ninguna pregunta como no sabida. Cuando lo hagas, acá aparecen los temas
        con más errores.
      </p>
    );
  }
  return (
    <ol className={estilos.reforzar}>
      {temas.map((t) => (
        <li key={t.tema.id}>
          <b>{t.tema.nombre}</b>
          <small>
            {t.no} no sabidas de {t.si + t.no} respondidas, {t.pct}% del tema sabido
          </small>
        </li>
      ))}
    </ol>
  );
}
