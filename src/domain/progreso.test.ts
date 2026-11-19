import {
  combinarProgreso,
  estaPendiente,
  idsDeMateria,
  limpiarHuerfanos,
  marcaDe,
  marcar,
  pendientesDelTema,
  progresoVacio,
  registrarFallo,
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

  it('registra y acumula fallos sin cambiar la marca', () => {
    const p1 = registrarFallo(progresoVacio, 'a1');
    const p2 = registrarFallo(p1, 'a1');
    expect(p2.fallos).toEqual({ a1: 2 });
    expect(p2.marcas).toEqual({});
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

  it('limpiarHuerfanos tambien limpia contadores', () => {
    const ids = idsDeMateria(materiaEjemplo());
    const p = { marcas: {}, fallos: { a1: 2, x9: 4 } };
    expect(limpiarHuerfanos(p, ids).fallos).toEqual({ a1: 2 });
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

  it('combinarProgreso: vista en alguno queda vista, "no" en alguno queda "no"', () => {
    const a = { marcas: { x: 'si', y: 'si', z: 'no' }, fallos: { z: 2, w: 1 } } as const;
    const b = { marcas: { x: 'si', y: 'no', v: 'si' }, fallos: { z: 1, w: 4 } } as const;
    const r = combinarProgreso(a, b);
    expect(r.marcas).toEqual({ x: 'si', y: 'no', z: 'no', v: 'si' });
    expect(r.fallos).toEqual({ z: 2, w: 4 });
    expect(combinarProgreso(b, a).marcas).toEqual(r.marcas);
    expect(combinarProgreso(b, a).fallos).toEqual(r.fallos);
  });

  it('combinarProgreso: sin datos en ninguno sigue vacio', () => {
    expect(combinarProgreso(progresoVacio, progresoVacio)).toEqual({ marcas: {} });
  });
});
