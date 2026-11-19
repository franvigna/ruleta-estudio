import { describe, expect, it } from 'vitest';
import {
  actual,
  agregar,
  avanzar,
  historialCon,
  historialVacio,
  puedeAvanzar,
  puedeRetroceder,
  retroceder,
} from './historial';

const a = { temaId: 't1', preguntaId: 'a1' };
const b = { temaId: 't1', preguntaId: 'a2' };
const c = { temaId: 't1', preguntaId: 'a3' };

describe('historial', () => {
  it('vacio no navega ni tiene actual', () => {
    expect(puedeRetroceder(historialVacio)).toBe(false);
    expect(puedeAvanzar(historialVacio)).toBe(false);
    expect(retroceder(historialVacio)).toBe(historialVacio);
    expect(avanzar(historialVacio)).toBe(historialVacio);
    expect(actual(historialVacio)).toBeUndefined();
  });

  it('agregar deja el cursor en la ultima y permite ir y venir', () => {
    const h = agregar(agregar(historialCon(a), b), c);
    expect(h.items).toEqual([a, b, c]);
    expect(actual(h)).toBe(c);
    expect(puedeAvanzar(h)).toBe(false);

    const h1 = retroceder(h);
    expect(actual(h1)).toBe(b);
    expect(puedeAvanzar(h1)).toBe(true);
    const h0 = retroceder(h1);
    expect(actual(h0)).toBe(a);
    expect(puedeRetroceder(h0)).toBe(false);
    expect(retroceder(h0)).toBe(h0);
    expect(actual(avanzar(avanzar(h0)))).toBe(c);
    expect(avanzar(h)).toBe(h);
  });
});
