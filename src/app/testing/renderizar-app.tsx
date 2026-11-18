import { render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { rngSecuencia } from '../../domain/random';
import { azarPendientes } from '../../domain/seleccion/azar-pendientes';
import type { MateriaId, Progreso } from '../../domain/types';
import { crearContenidoRepo } from '../../infra/contenido-repo';
import { crearMemoryRepo } from '../../infra/memory-repo';
import type { ProgresoRepositorio } from '../../infra/progreso-repo';
import { DependenciasProvider } from '../providers/DependenciasProvider';
import { ProgresoProvider } from '../providers/ProgresoProvider';
import { RutasApp } from '../routes';
import { crearAnimadorFalso, type AnimadorFalso } from './animador-falso';

/** Materia fixture: dos temas con dos preguntas cada uno. */
export const MATERIA_DEMO = {
  id: 'demo',
  nombre: 'Demo',
  descripcion: 'Materia de prueba',
  areas: [
    { id: 'AA', nombre: 'Area A', color: '#ffd84d', colorSuave: '#ffe993' },
    { id: 'BB', nombre: 'Area B', color: '#6fd99a', colorSuave: '#b0eec8' },
  ],
  temas: [
    {
      id: 'uno',
      nombre: 'Tema Uno',
      etiquetaCorta: 'T1',
      area: 'AA',
      preguntas: [
        {
          id: 'a1',
          tipo: 'teorica',
          enunciado: '<p>Pregunta a1</p>',
          respuesta: '<p>Respuesta a1</p>',
        },
        {
          id: 'a2',
          tipo: 'teorica',
          enunciado: '<p>Pregunta a2</p>',
          respuesta: '<p>Respuesta a2</p>',
        },
      ],
    },
    {
      id: 'dos',
      nombre: 'Tema Dos',
      etiquetaCorta: 'T2',
      area: 'BB',
      preguntas: [
        {
          id: 'b1',
          tipo: 'teorica',
          enunciado: '<p>Pregunta b1</p>',
          respuesta: '<p>Respuesta b1</p>',
        },
        {
          id: 'b2',
          tipo: 'teorica',
          enunciado: '<p>Pregunta b2</p>',
          respuesta: '<p>Respuesta b2</p>',
        },
      ],
    },
  ],
};

export const CATALOGO_DEMO = [
  {
    id: 'demo',
    nombre: 'Demo',
    descripcion: 'Materia de prueba',
    cantidadTemas: 2,
    cantidadPreguntas: 4,
  },
  {
    id: 'otra',
    nombre: 'Otra materia',
    descripcion: 'Segunda materia de prueba',
    cantidadTemas: 1,
    cantidadPreguntas: 2,
  },
];

export interface OpcionesRenderizado {
  ruta?: string;
  /**
   * Valores del rng (cicla). Por defecto [0.1, 0.5, 0, 0]: en cada giro elige el tema
   * 'uno', sin desvio, 5 vueltas, y el mazo de dos preguntas sale como [a2, a1] -> a1.
   * Con 0.9 en la primera posicion elige 'dos'.
   */
  rng?: readonly number[];
  reducido?: boolean;
  progresoInicial?: Record<MateriaId, Progreso>;
  fallarAlGuardar?: boolean;
  persistente?: boolean;
  repositorio?: ProgresoRepositorio;
}

export interface AppRenderizada {
  user: ReturnType<typeof userEvent.setup>;
  animador: AnimadorFalso;
  repositorio: ProgresoRepositorio;
  vista: RenderResult;
}

/** Renderiza RutasApp en un MemoryRouter con dependencias falsas y deterministas. */
export function renderizarApp(op: OpcionesRenderizado = {}): AppRenderizada {
  const animador = crearAnimadorFalso();
  const repositorio =
    op.repositorio ??
    crearMemoryRepo(op.progresoInicial, { fallarAlGuardar: op.fallarAlGuardar ?? false });
  const contenido = crearContenidoRepo({
    catalogo: () => Promise.resolve(CATALOGO_DEMO),
    materias: { demo: () => Promise.resolve(MATERIA_DEMO) },
  });
  const deps = {
    contenido,
    rng: rngSecuencia(op.rng ?? [0.1, 0.5, 0, 0]),
    animador,
    reducido: op.reducido ?? false,
    estrategia: azarPendientes,
  };
  const user = userEvent.setup();
  const vista = render(
    <StrictMode>
      <DependenciasProvider deps={deps}>
        <ProgresoProvider repositorio={repositorio} persistente={op.persistente ?? true}>
          <MemoryRouter initialEntries={[op.ruta ?? '/materia/demo']}>
            <RutasApp />
          </MemoryRouter>
        </ProgresoProvider>
      </DependenciasProvider>
    </StrictMode>,
  );
  return { user, animador, repositorio, vista };
}
