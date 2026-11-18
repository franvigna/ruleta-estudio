import type { Progreso } from '../../domain/types';
import { estadoInicial, progresoReducer } from './progreso-reducer';

const p: Progreso = { marcas: { a: 'si' } };

describe('progresoReducer', () => {
  it('cargaIniciada marca cargando y no pisa una materia lista', () => {
    const s1 = progresoReducer(estadoInicial(true), { tipo: 'cargaIniciada', materiaId: 'm' });
    expect(s1.porMateria['m']).toEqual({ estado: 'cargando' });
    const s2 = progresoReducer(s1, { tipo: 'cargado', materiaId: 'm', progreso: p });
    expect(s2.porMateria['m']).toEqual({ estado: 'listo', progreso: p });
    expect(progresoReducer(s2, { tipo: 'cargaIniciada', materiaId: 'm' })).toBe(s2);
  });

  it.each(['huerfanosLimpiados', 'marcado', 'reiniciado'] as const)(
    '%s deja el progreso listo',
    (tipo) => {
      const s = progresoReducer(estadoInicial(true), { tipo, materiaId: 'm', progreso: p });
      expect(s.porMateria['m']).toEqual({ estado: 'listo', progreso: p });
    },
  );

  it('guardadoResultado alterna guardadoFallido y conserva la referencia si no cambia', () => {
    const s0 = estadoInicial(true);
    expect(progresoReducer(s0, { tipo: 'guardadoResultado', ok: true })).toBe(s0);
    const s1 = progresoReducer(s0, { tipo: 'guardadoResultado', ok: false });
    expect(s1.guardadoFallido).toBe(true);
    expect(progresoReducer(s1, { tipo: 'guardadoResultado', ok: true }).guardadoFallido).toBe(
      false,
    );
  });

  it('conserva persistente', () => {
    expect(estadoInicial(false).persistente).toBe(false);
  });
});
