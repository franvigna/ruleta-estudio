import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { progresoVacio } from '../../domain/progreso';
import {
  alReiniciar,
  girar as girarSesion,
  otraDelTema,
  puedeMarcar,
  sesionInicial,
  terminarGiro as terminarGiroSesion,
  voltear as voltearSesion,
  type EstadoSesion,
} from '../../domain/sesion';
import type { ContextoSeleccion } from '../../domain/seleccion/estrategia';
import type { Marca, Materia } from '../../domain/types';
import { useDependencias } from './DependenciasProvider';
import { useProgreso } from './ProgresoProvider';

export interface UsoSesion {
  materia: Materia;
  estado: EstadoSesion<unknown>;
  girar(): void;
  terminarGiro(): void;
  otra(): void;
  voltear(): void;
  marcar(m: Marca): void;
  reiniciar(): void;
}

const Contexto = createContext<UsoSesion | null>(null);

/**
 * Sesion de la ruleta de una materia. Las transiciones (que consumen rng) corren en
 * los handlers y no en reducers ni efectos, asi el rng se consume una vez por evento
 * tambien en StrictMode. Se monta con key={materia.id}.
 */
export function SesionProvider({ materia, children }: { materia: Materia; children: ReactNode }) {
  const { rng, reducido, estrategia } = useDependencias();
  const progreso = useProgreso(materia.id);
  const { marcar: marcarProgreso, reiniciar: reiniciarProgreso, leerUltimo } = progreso;

  const [estado, setEstado] = useState<EstadoSesion<unknown>>(() => sesionInicial(estrategia));
  const ref = useRef<EstadoSesion<unknown>>(estado);

  const aplicar = useCallback((f: (s: EstadoSesion<unknown>) => EstadoSesion<unknown>) => {
    const actual = ref.current;
    const siguiente = f(actual);
    if (siguiente === actual) return;
    ref.current = siguiente;
    setEstado(siguiente);
  }, []);

  // El contexto se arma en el momento del evento: ultimo progreso y pregunta visible.
  const armarCtx = useCallback(
    (s: EstadoSesion<unknown>): ContextoSeleccion => ({
      materia,
      progreso: leerUltimo() ?? progresoVacio,
      anteriorId: s.contenido.tipo === 'tarjeta' ? s.contenido.preguntaId : null,
    }),
    [materia, leerUltimo],
  );

  const valor = useMemo<UsoSesion>(
    () => ({
      materia,
      estado,
      girar: () => aplicar((s) => girarSesion(s, armarCtx(s), estrategia, reducido, rng)),
      terminarGiro: () =>
        aplicar((s) => terminarGiroSesion(s, armarCtx(s), estrategia, reducido, rng)),
      otra: () => aplicar((s) => otraDelTema(s, armarCtx(s), estrategia, reducido, rng)),
      voltear: () => aplicar((s) => voltearSesion(s)),
      marcar(m) {
        const s = ref.current;
        if (!puedeMarcar(s) || s.contenido.tipo !== 'tarjeta') return;
        marcarProgreso(s.contenido.preguntaId, m);
      },
      reiniciar() {
        reiniciarProgreso();
        aplicar((s) => alReiniciar(s, estrategia));
      },
    }),
    [
      materia,
      estado,
      aplicar,
      armarCtx,
      estrategia,
      reducido,
      rng,
      marcarProgreso,
      reiniciarProgreso,
    ],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSesion(): UsoSesion {
  const v = useContext(Contexto);
  if (!v) throw new Error('Falta <SesionProvider>');
  return v;
}
