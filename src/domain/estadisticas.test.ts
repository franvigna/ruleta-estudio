import {
  estadisticasPorTema,
  estadisticasTema,
  porcentajeAproximado,
  resumenMateria,
  temasAReforzar,
} from './estadisticas';
import { marcar, progresoVacio } from './progreso';
import type { Marca, Progreso } from './types';
import { materia, materiaEjemplo, tema } from './testing/fixtures';

const prog = (marcas: Record<string, Marca>): Progreso => ({ marcas });

describe('estadisticas', () => {
  it('conteos y pct con redondeo', () => {
    const t = materiaEjemplo().temas[0]!; // a1 a2 a3
    const e = estadisticasTema(t, prog({ a1: 'si', a2: 'no' }));
    expect(e).toMatchObject({ total: 3, si: 1, no: 1, sin: 1, pct: 33 });
    expect(e.tema).toBe(t);
    const t2 = materiaEjemplo().temas[1]!;
    expect(estadisticasTema(t2, prog({ b1: 'si' })).pct).toBe(50);
  });

  it('tema sin preguntas no da NaN', () => {
    expect(estadisticasTema(tema('v', 'CC', []), progresoVacio).pct).toBe(0);
  });

  it('estadisticasPorTema respeta el orden de la ruleta', () => {
    const r = estadisticasPorTema(materiaEjemplo(), progresoVacio);
    expect(r.map((e) => e.tema.id)).toEqual(['t1', 't2', 't3']);
  });

  it('resumen ignora huerfanos', () => {
    const r = resumenMateria(materiaEjemplo(), prog({ a1: 'si', x1: 'si', x2: 'no', b1: 'no' }));
    expect(r).toEqual({ total: 6, si: 1, no: 1, sin: 4, pct: 17 });
  });

  describe('temasAReforzar', () => {
    const ids = (m: ReturnType<typeof materia>, p: Progreso, l?: number) =>
      temasAReforzar(m, p, l).map((e) => e.tema.id);

    it('lista vacia sin ninguna no', () => {
      expect(temasAReforzar(materiaEjemplo(), prog({ a1: 'si' }))).toEqual([]);
    });

    it('solo temas con no y tasa de error descendente', () => {
      const p = prog({ a1: 'no', a2: 'si', b1: 'no', c1: 'si' });
      // t1: 1/2=.5, t2: 1/1=1, t3 sin no
      const r = temasAReforzar(materiaEjemplo(), p);
      expect(r.map((e) => e.tema.id)).toEqual(['t2', 't1']);
      expect(r.map((e) => e.tasaError)).toEqual([1, 0.5]);
    });

    it('empate de tasa: mas no primero', () => {
      const m = materia([tema('x', 'CC', ['x1', 'x2', 'x3', 'x4']), tema('y', 'CC', ['y1', 'y2'])]);
      // x: 2 no, 2 si -> .5 ; y: 1 no, 1 si -> .5
      const p = prog({ x1: 'no', x2: 'no', x3: 'si', x4: 'si', y1: 'no', y2: 'si' });
      expect(ids(m, p)).toEqual(['x', 'y']);
    });

    it('empate de tasa y no: menor pct primero', () => {
      const m = materia([
        tema('x', 'CC', ['x1', 'x2', 'x3', 'x4']), // 1 no 1 si, 2 sin -> pct 25
        tema('y', 'CC', ['y1', 'y2']), // 1 no 1 si -> pct 50
      ]);
      const p = prog({ x1: 'no', x2: 'si', y1: 'no', y2: 'si' });
      expect(ids(m, p)).toEqual(['x', 'y']);
      const m2 = materia([
        tema('y', 'CC', ['y1', 'y2']),
        tema('x', 'CC', ['x1', 'x2', 'x3', 'x4']),
      ]);
      expect(ids(m2, p)).toEqual(['x', 'y']);
    });

    it('empate total: orden de la ruleta', () => {
      const m = materia([tema('p', 'CC', ['p1', 'p2']), tema('q', 'CC', ['q1', 'q2'])]);
      const p = prog({ p1: 'no', q1: 'no' });
      expect(ids(m, p)).toEqual(['p', 'q']);
    });

    it('corta en 3 por defecto y acepta limite', () => {
      const m = materia(['a', 'b', 'c', 'd'].map((id) => tema(id, 'CC', [id + '1'])));
      const p = prog({ a1: 'no', b1: 'no', c1: 'no', d1: 'no' });
      expect(ids(m, p)).toEqual(['a', 'b', 'c']);
      expect(ids(m, p, 2)).toEqual(['a', 'b']);
    });
  });

  describe('porcentajeAproximado', () => {
    it('cuenta las si y redondea', () => {
      const p = marcar(marcar(progresoVacio, 'a', 'si'), 'b', 'no');
      expect(porcentajeAproximado(p, 3)).toBe(33);
    });
    it('recorta a 100 (huerfanos) y maneja 0 preguntas', () => {
      const p = prog({ a: 'si', b: 'si', c: 'si' });
      expect(porcentajeAproximado(p, 2)).toBe(100);
      expect(porcentajeAproximado(p, 0)).toBe(0);
    });
  });
});
