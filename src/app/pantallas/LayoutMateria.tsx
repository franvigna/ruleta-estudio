import { useEffect, useState, type CSSProperties } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { idsDeMateria } from '../../domain/progreso';
import type { Materia } from '../../domain/types';
import { ErrorContenido } from '../../infra/contenido-repo';
import { AvisoGuardado, variablesDeAreas } from '../../shared/ui';
import { useDependencias } from '../providers/DependenciasProvider';
import { SesionProvider } from '../providers/SesionProvider';
import { useAvisoGuardado, useProgreso } from '../providers/ProgresoProvider';
import { HREF_CATALOGO } from '../router';
import estilos from './LayoutMateria.module.css';

type Resultado =
  | { readonly id: string; readonly estado: 'listo'; readonly materia: Materia }
  | { readonly id: string; readonly estado: 'noEncontrada' }
  | { readonly id: string; readonly estado: 'error'; readonly mensaje: string };

function EnlaceCatalogo() {
  return (
    <Link className={estilos.enlace} to={HREF_CATALOGO}>
      Volver a las materias
    </Link>
  );
}

export function LayoutMateria() {
  const { id = '' } = useParams();
  const { contenido } = useDependencias();
  const aviso = useAvisoGuardado();
  const { limpiarHuerfanos, progreso } = useProgreso(id);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let vigente = true;
    contenido.materia(id).then(
      (materia) => {
        if (vigente) {
          setResultado(materia ? { id, estado: 'listo', materia } : { id, estado: 'noEncontrada' });
        }
      },
      (e: unknown) => {
        if (!vigente) return;
        const mensaje =
          e instanceof ErrorContenido || e instanceof Error ? e.message : 'Error desconocido';
        setResultado({ id, estado: 'error', mensaje });
      },
    );
    return () => {
      vigente = false;
    };
  }, [contenido, id]);

  const actual = resultado?.id === id ? resultado : null;
  const materia = actual?.estado === 'listo' ? actual.materia : null;
  const progresoListo = progreso !== null;

  // Solo en memoria: se persiste recien en el proximo guardado (como el legacy).
  useEffect(() => {
    if (materia && progresoListo) limpiarHuerfanos(idsDeMateria(materia));
  }, [materia, progresoListo, limpiarHuerfanos]);

  if (!actual) {
    return (
      <main className={estilos.mensaje}>
        <p role="status">Cargando materia...</p>
      </main>
    );
  }
  if (actual.estado === 'noEncontrada') {
    return (
      <main className={estilos.mensaje}>
        <h1>Materia no encontrada</h1>
        <p>No existe una materia con ese identificador.</p>
        <EnlaceCatalogo />
      </main>
    );
  }
  if (actual.estado === 'error') {
    return (
      <main className={estilos.mensaje}>
        <h1>No se pudo cargar la materia</h1>
        <p role="alert">{actual.mensaje}</p>
        <EnlaceCatalogo />
      </main>
    );
  }

  return (
    <div
      className={estilos.materia}
      style={variablesDeAreas(actual.materia.areas) as CSSProperties}
    >
      {aviso.mostrar && <AvisoGuardado />}
      <SesionProvider key={actual.materia.id} materia={actual.materia}>
        <Outlet />
      </SesionProvider>
    </div>
  );
}
