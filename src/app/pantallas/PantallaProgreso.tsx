import { Link } from 'react-router-dom';
import {
  estadisticasPorTema,
  preguntasMasDificiles,
  resumenMateria,
  temasAReforzar,
} from '../../domain/estadisticas';
import { progresoVacio } from '../../domain/progreso';
import { PanelProgreso } from '../../features/progreso';
import { useProgreso } from '../providers/ProgresoProvider';
import { useSesion } from '../providers/SesionProvider';
import { hrefMateria } from '../router';
import estilos from './PantallaProgreso.module.css';

export function PantallaProgreso() {
  const sesion = useSesion();
  const { materia } = sesion;
  const { progreso } = useProgreso(materia.id);
  const p = progreso ?? progresoVacio;

  return (
    <main className={estilos.progreso} aria-labelledby="titulo-progreso">
      <h1 id="titulo-progreso">Tu progreso</h1>
      <p className={estilos.sub}>
        Se guarda en este navegador. Las preguntas que marcás como sabidas salen de la ruleta; las
        que no, siguen para repasar.
      </p>
      <PanelProgreso
        resumen={resumenMateria(materia, p)}
        reforzar={temasAReforzar(materia, p)}
        porTema={estadisticasPorTema(materia, p)}
        preguntasDificiles={preguntasMasDificiles(materia, p)}
        alReiniciar={sesion.reiniciar}
      />
      <Link className={estilos.volver} to={hrefMateria(materia.id)}>
        Volver a la ruleta
      </Link>
    </main>
  );
}
