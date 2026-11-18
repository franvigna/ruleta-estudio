import { estadisticasPorTema, resumenMateria } from '../../domain/estadisticas';
import { progresoVacio } from '../../domain/progreso';
import { PanelProgreso } from '../../features/progreso';
import { useProgreso } from '../providers/ProgresoProvider';
import { useSesion } from '../providers/SesionProvider';
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
        porTema={estadisticasPorTema(materia, p)}
        progreso={p}
        alReiniciar={sesion.reiniciar}
      />
    </main>
  );
}
