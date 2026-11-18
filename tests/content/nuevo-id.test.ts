import { describe, expect, it } from 'vitest';
import { sugerirId } from '../../scripts/lib/nuevo-id';
import type { MateriaContenido, TipoPreguntaContenido } from '../../src/content/schema';

function pregunta(id: string, tipo: TipoPreguntaContenido = 'teorica') {
  return { id, tipo, enunciado: '<p>e</p>', respuesta: '<p>r</p>' };
}

function materia(temas: Record<string, string[]>): MateriaContenido {
  return {
    id: 'm',
    nombre: 'M',
    descripcion: 'd',
    areas: [{ id: 'a', nombre: 'A', color: '#FFFFFF', colorSuave: '#EEEEEE' }],
    temas: Object.entries(temas).map(([id, ids]) => ({
      id,
      nombre: id,
      etiquetaCorta: id,
      area: 'a',
      preguntas: ids.map((i) => pregunta(i)),
    })),
  };
}

describe('sugerirId', () => {
  it('usa el maximo subindice de la clase en toda la materia', () => {
    const m = materia({
      'tema-a': ['t2.1', 't2.2'],
      'tema-b': ['t2.5', 't3.1'],
    });
    expect(sugerirId(m, 'tema-a', 'teorica')).toBe('t2.6');
  });

  it('elige la clase mas frecuente del tema', () => {
    const m = materia({
      'tema-a': ['t1.1', 't2.1', 't2.2'],
      'tema-b': ['t1.7'],
    });
    expect(sugerirId(m, 'tema-a', 'teorica')).toBe('t2.3');
  });

  it('en empate de frecuencia elige la clase menor', () => {
    const m = materia({ 'tema-a': ['t4.1', 't3.2'] });
    expect(sugerirId(m, 'tema-a', 'teorica')).toBe('t3.3');
  });

  it('tema sin patron: <tema>-<n> desde cantidad+1', () => {
    const m = materia({ 'tema-a': ['x', 'y'] });
    expect(sugerirId(m, 'tema-a', 'teorica')).toBe('tema-a-3');
  });

  it('salta el candidato ya tomado en la materia', () => {
    const m = materia({ 'tema-a': ['x', 'y'], 'tema-b': ['tema-a-3', 'tema-a-4'] });
    expect(sugerirId(m, 'tema-a', 'teorica')).toBe('tema-a-5');
  });

  it('reflexion ignora el patron de clase', () => {
    const m = materia({ 'tema-a': ['t2.1', 't2.2'] });
    expect(sugerirId(m, 'tema-a', 'reflexion')).toBe('tema-a-3');
  });

  it('votacion en tema vacio de ids: n = 1 si no hay preguntas', () => {
    const m = materia({ 'tema-a': [] });
    expect(sugerirId(m, 'tema-a', 'votacion')).toBe('tema-a-1');
  });

  it('nunca devuelve un id existente', () => {
    const m = materia({ 'tema-a': ['t1.1', 't1.2', 't1.3'] });
    const id = sugerirId(m, 'tema-a', 'teorica');
    expect(m.temas.flatMap((t) => t.preguntas.map((p) => p.id))).not.toContain(id);
  });

  it('falla si el tema no existe', () => {
    expect(() => sugerirId(materia({ a: ['x'] }), 'zzz', 'teorica')).toThrow(/zzz/);
  });
});
