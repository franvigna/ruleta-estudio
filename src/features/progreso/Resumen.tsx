import type { Conteo } from '../../domain/estadisticas';
import estilos from './Resumen.module.css';

function Dato({ valor, texto }: { valor: string; texto: string }) {
  return (
    <div className={estilos.dato}>
      <b>{valor}</b>
      <span>{texto}</span>
    </div>
  );
}

export function Resumen({ resumen }: { resumen: Conteo }) {
  return (
    <div className={estilos.resumen}>
      <Dato valor={`${resumen.pct}%`} texto="de la materia sabida" />
      <Dato valor={String(resumen.si)} texto={`sabidas de ${resumen.total}`} />
      <Dato valor={String(resumen.no)} texto="para repasar" />
      <Dato valor={String(resumen.sin)} texto="sin responder" />
    </div>
  );
}
