import { useEffect, useMemo, useRef, useState } from 'react';
import { progresoVacio } from '../../domain/progreso';
import { estadoPantalla } from '../../domain/sesion';
import { AyudaAtajos, useAtajosTeclado } from '../../features/atajos';
import { Leyenda, Ruleta } from '../../features/ruleta';
import { ColumnaTarjeta, type ContenidoColumna } from '../../features/tarjeta';
import {
  activarSonido,
  Boton,
  sonidoSeleccion,
  sonidoTac,
  sonidoTrompetaTriste,
  sonidoVictoria,
} from '../../shared/ui';
import { useDependencias } from '../providers/DependenciasProvider';
import { useProgreso } from '../providers/ProgresoProvider';
import { useSesion } from '../providers/SesionProvider';
import estilos from './PantallaRuleta.module.css';

export function PantallaRuleta() {
  const { materia, estado, girar, terminarGiro, otra, voltear, marcar } = useSesion();
  const { animador, estrategia } = useDependencias();
  const { progreso } = useProgreso(materia.id);
  const refColumna = useRef<HTMLElement>(null);
  const refRuleta = useRef<HTMLElement>(null);
  const [tarjetaVisible, setTarjetaVisible] = useState(false);

  const enfocarRuleta = () => {
    requestAnimationFrame(() => {
      refRuleta.current?.querySelector<HTMLElement>('[role="button"]')?.focus();
    });
  };

  const girarConSonido = () => {
    setTarjetaVisible(false);
    activarSonido();
    girar();
    enfocarRuleta();
  };
  const terminarConSonido = () => {
    sonidoSeleccion();
    terminarGiro();
    setTarjetaVisible(true);
  };
  const marcarConSonido = (marca: 'si' | 'no') => {
    if (marca === 'si') sonidoVictoria();
    else sonidoTrompetaTriste();
    marcar(marca);
  };

  useAtajosTeclado({ girar: girarConSonido, voltear, marcar: marcarConSonido });

  const contenido = estado.contenido;
  const preguntaId = contenido.tipo === 'tarjeta' ? contenido.preguntaId : null;
  const mostrarTarjeta = tarjetaVisible && contenido.tipo === 'tarjeta' && !estado.giro;
  const puedeReabrir = contenido.tipo === 'tarjeta' && !mostrarTarjeta && !estado.giro;

  useEffect(() => {
    if (mostrarTarjeta) refColumna.current?.focus();
  }, [mostrarTarjeta]);

  useEffect(() => {
    const ruleta = refRuleta.current;
    if (!ruleta) return;
    if (mostrarTarjeta) ruleta.setAttribute('inert', '');
    else ruleta.removeAttribute('inert');
  }, [mostrarTarjeta]);

  const cerrarTarjeta = () => {
    setTarjetaVisible(false);
    enfocarRuleta();
  };

  const reabrirTarjeta = () => {
    setTarjetaVisible(true);
  };

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
      repaso: contenido.repaso && progreso?.marcas[pregunta.id] !== 'si',
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
      <AyudaAtajos />
      <div className={estilos.escenario}>
        <section
          ref={refRuleta}
          className={`${estilos.ruletaVista} ${mostrarTarjeta ? estilos.ruletaOculta : ''}`}
          aria-label="Ruleta"
          aria-hidden={mostrarTarjeta || undefined}
        >
          <h1>Ruleta de {materia.nombre}</h1>
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
          <Leyenda areas={materia.areas} />
          {contenido.tipo === 'todo-sabido' ? (
            <p className={estilos.todoSabido}>Te sabés todas las preguntas de esta materia.</p>
          ) : null}
          {puedeReabrir ? (
            <Boton className={estilos.verPregunta} onClick={reabrirTarjeta}>
              Ver pregunta
            </Boton>
          ) : null}
        </section>
        {mostrarTarjeta ? (
          <div className={estilos.capaTarjeta}>
            <ColumnaTarjeta
              ref={refColumna}
              contenido={columna}
              ocupado={estadoPantalla(estado) === 'girando'}
              alCerrar={cerrarTarjeta}
              alVoltear={voltear}
              alMarcar={marcarConSonido}
              alOtra={otra}
              alGirarDeNuevo={girarConSonido}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
