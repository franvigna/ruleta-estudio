import { estadisticasPorTema, resumenMateria } from '../../domain/estadisticas';
import { idsDeMateria, progresoVacio } from '../../domain/progreso';
import { PanelProgreso, RespaldoProgreso } from '../../features/progreso';
import { crearRespaldo, ErrorRespaldo, leerRespaldo } from '../../infra/respaldo';
import { useProgreso } from '../providers/ProgresoProvider';
import { useSesion } from '../providers/SesionProvider';
import estilos from './PantallaProgreso.module.css';

export function PantallaProgreso() {
  const sesion = useSesion();
  const { materia } = sesion;
  const { progreso, importar } = useProgreso(materia.id);
  const p = progreso ?? progresoVacio;

  const alImportar = (codigo: string) => {
    try {
      const respaldo = leerRespaldo(codigo);
      if (respaldo.materiaId !== materia.id) {
        return { ok: false, mensaje: 'Ese código es de otra materia.' };
      }
      if (!importar(respaldo.progreso, idsDeMateria(materia))) {
        return { ok: false, mensaje: 'El progreso todavía está cargando. Probá de nuevo.' };
      }
      return { ok: true, mensaje: 'Progreso importado.' };
    } catch (e) {
      return {
        ok: false,
        mensaje: e instanceof ErrorRespaldo ? e.message : 'No se pudo importar el código.',
      };
    }
  };

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
      <RespaldoProgreso
        generarCodigo={() => crearRespaldo(materia.id, p)}
        alImportar={alImportar}
      />
    </main>
  );
}
