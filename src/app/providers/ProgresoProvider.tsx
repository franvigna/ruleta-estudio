import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import {
  limpiarHuerfanos as limpiarHuerfanosDe,
  marcar as marcarEn,
  registrarFallo,
  reiniciar as progresoReiniciado,
} from '../../domain/progreso';
import type { Marca, MateriaId, PreguntaId, Progreso } from '../../domain/types';
import type { ProgresoRepositorio } from '../../infra/progreso-repo';
import { estadoInicial, progresoReducer, type EstadoProgreso } from './progreso-reducer';

interface Acciones {
  asegurarCargado(materiaId: MateriaId): void;
  /** Ultimo progreso conocido (sincronico, para handlers). */
  leerUltimo(materiaId: MateriaId): Progreso | null;
  marcar(materiaId: MateriaId, id: PreguntaId, m: Marca, contarFallo: boolean): void;
  reiniciar(materiaId: MateriaId): void;
  limpiarHuerfanos(materiaId: MateriaId, ids: ReadonlySet<PreguntaId>): void;
}

interface ValorContexto {
  readonly estado: EstadoProgreso;
  readonly acciones: Acciones;
}

const Contexto = createContext<ValorContexto | null>(null);

export interface ProgresoProviderProps {
  repositorio: ProgresoRepositorio;
  persistente: boolean;
  children: ReactNode;
}

export function ProgresoProvider({ repositorio, persistente, children }: ProgresoProviderProps) {
  const [estado, despachar] = useReducer(progresoReducer, persistente, estadoInicial);
  // Ultimo progreso por materia: se actualiza en los handlers, antes del re-render.
  const ultimo = useRef(new Map<MateriaId, Progreso>());
  const iniciadas = useRef(new Set<MateriaId>());
  // Cadena de guardados para que no se pisen entre si.
  const cadena = useRef<Promise<void>>(Promise.resolve());

  const acciones = useMemo<Acciones>(() => {
    function encolar(tarea: () => Promise<void>): void {
      cadena.current = cadena.current.then(tarea).then(
        () => despachar({ tipo: 'guardadoResultado', ok: true }),
        () => despachar({ tipo: 'guardadoResultado', ok: false }),
      );
    }
    return {
      asegurarCargado(materiaId) {
        if (iniciadas.current.has(materiaId)) return;
        iniciadas.current.add(materiaId);
        despachar({ tipo: 'cargaIniciada', materiaId });
        repositorio
          .cargar(materiaId)
          .catch((): Progreso => progresoReiniciado())
          .then((progreso) => {
            ultimo.current.set(materiaId, progreso);
            despachar({ tipo: 'cargado', materiaId, progreso });
          });
      },
      leerUltimo: (materiaId) => ultimo.current.get(materiaId) ?? null,
      marcar(materiaId, id, m, contarFallo) {
        const actual = ultimo.current.get(materiaId);
        if (!actual) return;
        let siguiente = marcarEn(actual, id, m);
        if (contarFallo) siguiente = registrarFallo(siguiente, id);
        if (siguiente === actual) return;
        ultimo.current.set(materiaId, siguiente);
        despachar({ tipo: 'marcado', materiaId, progreso: siguiente });
        encolar(() => repositorio.guardar(materiaId, siguiente));
      },
      reiniciar(materiaId) {
        const vacio = progresoReiniciado();
        ultimo.current.set(materiaId, vacio);
        despachar({ tipo: 'reiniciado', materiaId, progreso: vacio });
        encolar(() => repositorio.reiniciar(materiaId));
      },
      limpiarHuerfanos(materiaId, ids) {
        const actual = ultimo.current.get(materiaId);
        if (!actual) return;
        const limpio = limpiarHuerfanosDe(actual, ids);
        if (limpio === actual) return;
        ultimo.current.set(materiaId, limpio);
        despachar({ tipo: 'huerfanosLimpiados', materiaId, progreso: limpio });
      },
    };
  }, [repositorio]);

  const valor = useMemo(() => ({ estado, acciones }), [estado, acciones]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

function useContextoProgreso(): ValorContexto {
  const v = useContext(Contexto);
  if (!v) throw new Error('Falta <ProgresoProvider>');
  return v;
}

export interface UsoProgreso {
  /** null mientras carga. */
  progreso: Progreso | null;
  marcar(id: PreguntaId, m: Marca, contarFallo?: boolean): void;
  reiniciar(): void;
  limpiarHuerfanos(ids: ReadonlySet<PreguntaId>): void;
  /** Ultimo progreso conocido, leido de un ref (para handlers). */
  leerUltimo(): Progreso | null;
}

export function useProgreso(materiaId: MateriaId): UsoProgreso {
  const { estado, acciones } = useContextoProgreso();
  useEffect(() => {
    acciones.asegurarCargado(materiaId);
  }, [acciones, materiaId]);
  const entrada = estado.porMateria[materiaId];
  const progreso = entrada?.estado === 'listo' ? entrada.progreso : null;
  const marcar = useCallback(
    (id: PreguntaId, m: Marca, contarFallo = false) =>
      acciones.marcar(materiaId, id, m, contarFallo),
    [acciones, materiaId],
  );
  const reiniciar = useCallback(() => acciones.reiniciar(materiaId), [acciones, materiaId]);
  const limpiarHuerfanos = useCallback(
    (ids: ReadonlySet<PreguntaId>) => acciones.limpiarHuerfanos(materiaId, ids),
    [acciones, materiaId],
  );
  const leerUltimo = useCallback(() => acciones.leerUltimo(materiaId), [acciones, materiaId]);
  return { progreso, marcar, reiniciar, limpiarHuerfanos, leerUltimo };
}

/** Progreso de varias materias (catalogo). null en las que aun cargan. */
export function useProgresosDe(
  ids: readonly MateriaId[],
): Readonly<Record<MateriaId, Progreso | null>> {
  const { estado, acciones } = useContextoProgreso();
  const clave = ids.join('\n');
  useEffect(() => {
    for (const id of clave === '' ? [] : clave.split('\n')) acciones.asegurarCargado(id);
  }, [acciones, clave]);
  const salida: Record<MateriaId, Progreso | null> = {};
  for (const id of ids) {
    const e = estado.porMateria[id];
    salida[id] = e?.estado === 'listo' ? e.progreso : null;
  }
  return salida;
}

/** El aviso se muestra cuando !persistente || guardadoFallido. */
export function useAvisoGuardado(): { mostrar: boolean } {
  const { estado } = useContextoProgreso();
  return { mostrar: !estado.persistente || estado.guardadoFallido };
}
