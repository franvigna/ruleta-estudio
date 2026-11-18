import {
  estaPendiente,
  idsDeMateria,
  limpiarHuerfanos,
  marcaDe,
  marcar,
  pendientesDelTema,
  progresoVacio,
  reiniciar,
  temaCompleto,
} from './progreso';
import { materiaEjemplo } from './testing/fixtures';

describe('progreso', () => {
  it('marcar es inmutable y corrige si->no', () => {
    const p1 = marcar(progresoVacio, 'a1', 'si');
    expect(progresoVacio.marcas).toEqual({});
    expect(marcaDe(p1, 'a1')).toBe('si');
    const p2 = marcar(p1, 'a1', 'no');
    expect(marcaDe(p2, 'a1')).toBe('no');
    expect(marcaDe(p1, 'a1')).toBe('si');
    expect(marcaDe(p2, 'zz')).toBeUndefined();
  });

  it('marcar devuelve la misma referencia si no cambia', () => {
    const p = marcar(progresoVacio, 'a1', 'si');
    expect(marcar(p, 'a1', 'si')).toBe(p);
  });

  it('reiniciar devuelve el progreso vacio', () => {
    expect(reiniciar()).toBe(progresoVacio);
  });

  it('limpiarHuerfanos quita ajenos y conserva validos', () => {
    const ids = idsDeMateria(materiaEjemplo());
    const p = { marcas: { a1: 'si', x9: 'no', b2: 'no' } as const };
    const r = limpiarHuerfanos(p, ids);
    expect(r.marcas).toEqual({ a1: 'si', b2: 'no' });
    expect(p.marcas).toHaveProperty('x9');
  });

  it('limpiarHuerfanos devuelve la misma ref si no habia huerfanos', () => {
    const ids = idsDeMateria(materiaEjemplo());
    const p = marcar(progresoVacio, 'a1', 'si');
    expect(limpiarHuerfanos(p, ids)).toBe(p);
    expect(limpiarHuerfanos(progresoVacio, ids)).toBe(progresoVacio);
  });

  it('idsDeMateria junta las preguntas de todos los temas', () => {
    expect([...idsDeMateria(materiaEjemplo())]).toEqual(['a1', 'a2', 'a3', 'b1', 'b2', 'c1']);
  });

  it('una no sigue pendiente, una si no', () => {
    let p = marcar(progresoVacio, 'a1', 'no');
    p = marcar(p, 'a2', 'si');
    expect(estaPendiente(p, 'a1')).toBe(true);
    expect(estaPendiente(p, 'a2')).toBe(false);
    expect(estaPendiente(p, 'a3')).toBe(true);
  });

  it('pendientes en orden del contenido y tema completo', () => {
    const t = materiaEjemplo().temas[0]!;
    let p = marcar(progresoVacio, 'a2', 'si');
    expect(pendientesDelTema(t, p).map((q) => q.id)).toEqual(['a1', 'a3']);
    expect(temaCompleto(t, p)).toBe(false);
    p = marcar(marcar(p, 'a1', 'si'), 'a3', 'si');
    expect(temaCompleto(t, p)).toBe(true);
  });
});
