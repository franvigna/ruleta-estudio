import type { Materia, Pregunta, Tema } from '../types';

export function pregunta(id: string): Pregunta {
  return { id, tipo: 'teorica', enunciado: `<p>${id}?</p>`, respuesta: `<p>${id}!</p>` };
}

export function tema(id: string, area: string, ids: readonly string[]): Tema {
  return { id, nombre: `Tema ${id}`, etiquetaCorta: id, area, preguntas: ids.map(pregunta) };
}

export function materia(temas: readonly Tema[]): Materia {
  return {
    id: 'm',
    nombre: 'Materia',
    descripcion: 'Descripcion',
    areas: [
      { id: 'CC', nombre: 'Conceptos', color: '#111', colorSuave: '#eee' },
      { id: 'DA', nombre: 'Diseno', color: '#222', colorSuave: '#ddd' },
    ],
    temas,
  };
}

/** Tres temas: t1 (a1,a2,a3), t2 (b1,b2), t3 (c1). */
export const materiaEjemplo = (): Materia =>
  materia([
    tema('t1', 'CC', ['a1', 'a2', 'a3']),
    tema('t2', 'CC', ['b1', 'b2']),
    tema('t3', 'DA', ['c1']),
  ]);
