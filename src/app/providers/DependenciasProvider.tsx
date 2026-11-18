import { createContext, useContext, type ReactNode } from 'react';
import type { Rng } from '../../domain/random';
import type { EstrategiaSeleccion } from '../../domain/seleccion/estrategia';
import type { ContenidoRepositorio } from '../../infra/contenido-repo';
import type { ProgresoRepositorio } from '../../infra/progreso-repo';
import type { ResultadoMigracion } from '../../infra/migraciones';
import type { Animador } from '../../features/ruleta';

export interface Dependencias {
  readonly progresoRepo: ProgresoRepositorio;
  /** false si el almacenamiento no esta disponible (se usa memoria). */
  readonly persistente: boolean;
  readonly contenido: ContenidoRepositorio;
  readonly rng: Rng;
  readonly animador: Animador;
  /** prefers-reduced-motion, leido una sola vez al iniciar. */
  readonly reducido: boolean;
  readonly estrategia: EstrategiaSeleccion<unknown>;
  readonly migracion: ResultadoMigracion;
}

export type DependenciasDeUi = Pick<
  Dependencias,
  'contenido' | 'rng' | 'animador' | 'reducido' | 'estrategia'
>;

const Contexto = createContext<DependenciasDeUi | null>(null);

export function DependenciasProvider({
  deps,
  children,
}: {
  deps: DependenciasDeUi;
  children: ReactNode;
}) {
  return <Contexto.Provider value={deps}>{children}</Contexto.Provider>;
}

export function useDependencias(): DependenciasDeUi {
  const v = useContext(Contexto);
  if (!v) throw new Error('Falta <DependenciasProvider>');
  return v;
}
