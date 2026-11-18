import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { porcentajeAproximado } from '../../domain/estadisticas';
import type { ItemCatalogo } from '../../domain/types';
import { ListaMaterias, type ItemConAvance } from '../../features/catalogo';
import { ErrorContenido } from '../../infra/contenido-repo';
import { AvisoGuardado } from '../../shared/ui';
import { useDependencias } from '../providers/DependenciasProvider';
import { useAvisoGuardado, useProgresosDe } from '../providers/ProgresoProvider';
import { hrefMateria } from '../router';
import estilos from './PantallaCatalogo.module.css';

type Resultado =
  | { readonly estado: 'cargando' }
  | { readonly estado: 'listo'; readonly items: readonly ItemCatalogo[] }
  | { readonly estado: 'error'; readonly mensaje: string };

export function PantallaCatalogo() {
  const { contenido } = useDependencias();
  const aviso = useAvisoGuardado();
  const [resultado, setResultado] = useState<Resultado>({ estado: 'cargando' });

  useEffect(() => {
    let vigente = true;
    contenido.catalogo().then(
      (items) => {
        if (vigente) setResultado({ estado: 'listo', items });
      },
      (e: unknown) => {
        if (!vigente) return;
        const mensaje =
          e instanceof ErrorContenido || e instanceof Error ? e.message : 'Error desconocido';
        setResultado({ estado: 'error', mensaje });
      },
    );
    return () => {
      vigente = false;
    };
  }, [contenido]);

  const items = useMemo(() => (resultado.estado === 'listo' ? resultado.items : []), [resultado]);
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const progresos = useProgresosDe(ids);
  const itemsConAvance = useMemo<readonly ItemConAvance[]>(
    () =>
      items.map((item) => ({
        ...item,
        pct: porcentajeAproximado(progresos[item.id] ?? { marcas: {} }, item.cantidadPreguntas),
      })),
    [items, progresos],
  );

  function renderEnlace(materiaId: string, contenidoEnlace: ReactNode, className?: string) {
    return (
      <Link to={hrefMateria(materiaId)} className={className}>
        {contenidoEnlace}
      </Link>
    );
  }

  return (
    <main className={estilos.catalogo}>
      {aviso.mostrar && <AvisoGuardado />}
      <header className={estilos.cabeza}>
        <p className={estilos.ceja}>Elegí una materia, girá y practicá</p>
        <h1>Ruleta de Estudio</h1>
        <p className={estilos.bajada}>
          Convertí el repaso en una ronda corta: una materia, un tema al azar y una pregunta por
          vez.
        </p>
      </header>

      {resultado.estado === 'cargando' ? <p role="status">Cargando materias...</p> : null}
      {resultado.estado === 'error' ? (
        <section className={estilos.error} aria-labelledby="titulo-error-catalogo">
          <h2 id="titulo-error-catalogo">No se pudo cargar el catálogo</h2>
          <p role="alert">{resultado.mensaje}</p>
        </section>
      ) : null}
      {resultado.estado === 'listo' ? (
        <ListaMaterias items={itemsConAvance} renderEnlace={renderEnlace} />
      ) : null}
    </main>
  );
}
