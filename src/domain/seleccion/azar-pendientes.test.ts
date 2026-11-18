import { marcar, progresoVacio } from '../progreso';
import { rngSecuencia } from '../random';
import { materiaEjemplo } from '../testing/fixtures';
import { azarPendientes as est } from './azar-pendientes';
import type { ContextoSeleccion } from './estrategia';

const materia = materiaEjemplo();
const ctx = (p = progresoVacio, anteriorId: string | null = null): ContextoSeleccion => ({
  materia,
  progreso: p,
  anteriorId,
});
const completar = (...ids: string[]) => ids.reduce((p, id) => marcar(p, id, 'si'), progresoVacio);

describe('azarPendientes', () => {
  it('estado inicial vacio y alReiniciar vacia los mazos', () => {
    expect(est.estadoInicial()).toEqual({});
    expect(est.alReiniciar({ t1: ['a1'] })).toEqual({});
  });

  it('temasDisponibles excluye los completos', () => {
    expect(est.temasDisponibles(ctx())).toEqual(['t1', 't2', 't3']);
    expect(est.temasDisponibles(ctx(completar('c1', 'b1', 'b2')))).toEqual(['t1']);
  });

  it('elegirTema usa disp[floor(rng*n)] y un solo consumo de rng', () => {
    const rng = vi.fn(() => 0.5);
    expect(est.elegirTema(ctx(), rng)).toBe('t2');
    expect(rng).toHaveBeenCalledTimes(1);
    expect(est.elegirTema(ctx(completar('b1', 'b2')), () => 0.99)).toBe('t3');
  });

  it('elegirTema devuelve null si todo esta sabido, sin consumir rng', () => {
    const rng = vi.fn(() => 0);
    const p = completar('a1', 'a2', 'a3', 'b1', 'b2', 'c1');
    expect(est.elegirTema(ctx(p), rng)).toBeNull();
    expect(rng).not.toHaveBeenCalled();
  });

  it('sacarPregunta usa el mazo y devuelve el estado nuevo', () => {
    const r = est.sacarPregunta(ctx(), est.estadoInicial(), 't1', rngSecuencia([0]))!;
    expect(r.preguntaId).toBe('a1');
    expect(r.estado['t1']).toEqual(['a2', 'a3']);
  });

  it('sacarPregunta devuelve null para tema completo o inexistente', () => {
    expect(est.sacarPregunta(ctx(completar('c1')), {}, 't3', () => 0)).toBeNull();
    expect(est.sacarPregunta(ctx(), {}, 'nope', () => 0)).toBeNull();
  });
});
