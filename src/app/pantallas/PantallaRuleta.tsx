import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { progresoVacio } from '../../domain/progreso';
import { estadoPantalla } from '../../domain/sesion';
import { AyudaAtajos, useAtajosTeclado } from '../../features/atajos';
import { Leyenda, Ruleta } from '../../features/ruleta';
import { ColumnaTarjeta, type ContenidoColumna } from '../../features/tarjeta';
import {
  activarSonido,
  sonidoSeleccion,
  sonidoTac,
  sonidoTrompetaTriste,
  sonidoVictoria,
  useEsMovil,
} from '../../shared/ui';
import { useDependencias } from '../providers/DependenciasProvider';
import { useProgreso } from '../providers/ProgresoProvider';
import { useSesion } from '../providers/SesionProvider';
import { HREF_CATALOGO, hrefProgreso } from '../router';
import estilos from './PantallaRuleta.module.css';

export function PantallaRuleta() {
  const { materia, estado, girar, terminarGiro, otra, voltear, marcar } = useSesion();
  const { animador, estrategia, reducido } = useDependencias();
  const { progreso } = useProgreso(materia.id);
  const esMovil = useEsMovil();
  const refColumna = useRef<HTMLElement>(null);

  const girarConSonido = () => {
    activarSonido();
    girar();
  };
  const terminarConSonido = () => {
    sonidoSeleccion();
    terminarGiro();
  };
  const marcarConSonido = (marca: 'si' | 'no') => {
    if (marca === 'si') sonidoVictoria();
    else sonidoTrompetaTriste();
    marcar(marca);
  };

  useAtajosTeclado({ girar: girarConSonido, voltear, marcar: marcarConSonido });

  const contenido = estado.contenido;
  const preguntaId = contenido.tipo === 'tarjeta' ? contenido.preguntaId : null;

  // En movil, al salir una pregunta nueva se baja a la tarjeta (no al montar la pantalla).
  const ultimaPregunta = useRef(preguntaId);
  useEffect(() => {
    if (preguntaId === ultimaPregunta.current) return;
    ultimaPregunta.current = preguntaId;
    if (esMovil && preguntaId) {
      refColumna.current?.scrollIntoView?.({
        behavior: reducido ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, [preguntaId, esMovil, reducido]);

  const disponibles = useMemo(
    () =>
      new Set(
        estrategia.temasDisponibles({
          materia,
          progreso: progreso ?? progresoVacio,
          anteriorId: preguntaId,
        }),
      ),
    [estrategia, materia, progreso, preguntaId],
  );

  const columna = useMemo<ContenidoColumna>(() => {
    if (contenido.tipo !== 'tarjeta') return { tipo: contenido.tipo };
    const tema = materia.temas.find((t) => t.id === contenido.temaId);
    const pregunta = tema?.preguntas.find((q) => q.id === contenido.preguntaId);
    if (!tema || !pregunta) return { tipo: 'vacio' };
    return {
      tipo: 'tarjeta',
      tema: { nombre: tema.nombre, area: tema.area },
      pregunta,
      dada: contenido.dada,
      marcarVisible: contenido.marcarVisible,
      repaso: contenido.repaso,
      marca: progreso?.marcas[pregunta.id],
    };
  }, [contenido, materia, progreso]);

  if (!progreso) {
    return (
      <main className={estilos.app}>
        <p role="status">Cargando progreso...</p>
      </main>
    );
  }

  return (
    <main className={estilos.app}>
      <section className={estilos.izq} aria-label="Ruleta">
        <h1>Ruleta de {materia.nombre}</h1>
        <p className={estilos.sub}>
          La ruleta gira, sortea un tema y te toca una pregunta al azar de ese tema.
        </p>
        <Ruleta
          temas={materia.temas}
          disponibles={disponibles}
          rot={estado.rot}
          giro={estado.giro}
          ganador={estado.ganador}
          animador={animador}
          alGirar={girarConSonido}
          alTic={sonidoTac}
          alTerminar={terminarConSonido}
          etiquetaAria={`Ruleta con los ${materia.temas.length} temas de la materia`}
        />
        <AyudaAtajos />
        <Leyenda areas={materia.areas} />
        <Link className={estilos.ir} to={hrefProgreso(materia.id)}>
          Ver tu progreso
        </Link>
        <Link className={estilos.ir} to={HREF_CATALOGO}>
          Volver a las materias
        </Link>
      </section>
      <ColumnaTarjeta
        ref={refColumna}
        contenido={columna}
        ocupado={estadoPantalla(estado) === 'girando'}
        alVoltear={voltear}
        alMarcar={marcarConSonido}
        alOtra={otra}
        alGirarDeNuevo={girarConSonido}
      />
    </main>
  );
}
