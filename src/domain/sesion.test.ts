import { marcar, progresoVacio } from './progreso';
import { rngSecuencia } from './random';
import { segmentoBajoPuntero } from './ruleta-math';
import {
  alReiniciar,
  anterior,
  estadoPantalla,
  girar,
  mostrar,
  otraDelTema,
  puedeMarcar,
  sesionInicial,
  terminarGiro,
  voltear,
  type EstadoSesion,
} from './sesion';
import type { Mazos } from './mazo';
import { azarPendientes as est } from './seleccion/azar-pendientes';
import type { ContextoSeleccion } from './seleccion/estrategia';
import { materiaEjemplo } from './testing/fixtures';
import type { Progreso } from './types';

const materia = materiaEjemplo(); // t1(a1 a2 a3) t2(b1 b2) t3(c1)
const ctx = (p: Progreso = progresoVacio, anteriorId: string | null = null): ContextoSeleccion => ({
  materia,
  progreso: p,
  anteriorId,
});
const sabidas = (...ids: string[]) => ids.reduce((p, id) => marcar(p, id, 'si'), progresoVacio);
const TODAS = sabidas('a1', 'a2', 'a3', 'b1', 'b2', 'c1');
const ini = (): EstadoSesion<Mazos> => sesionInicial(est);
const rng = () => rngSecuencia([0.5]);

/** Gira y termina con rng fijo; devuelve el estado con tarjeta. */
function conTarjeta(p: Progreso = progresoVacio, r = rngSecuencia([0])) {
  const g = girar(ini(), ctx(p), est, false, r);
  return terminarGiro(g, ctx(p), est, false, r);
}

describe('sesion', () => {
  it('estado inicial', () => {
    const s = ini();
    expect(s).toMatchObject({ rot: 0, giro: null, ganador: null, contenido: { tipo: 'vacio' } });
    expect(estadoPantalla(s)).toBe('inactivo');
  });

  it('girar planifica un giro hacia un tema disponible y consume rng en orden', () => {
    const usos: number[] = [];
    const r = () => (usos.push(1), 0.5);
    const s = girar(ini(), ctx(), est, false, r);
    expect(s.giro).not.toBeNull();
    expect(usos).toHaveLength(3); // elegirTema, desvio, vueltas
    expect(s.giro!.indice).toBe(1); // floor(.5*3)
    expect(segmentoBajoPuntero(s.giro!.desde + s.giro!.delta, 3)).toBe(1);
    expect(s.ganador).toBeNull();
    expect(estadoPantalla(s)).toBe('girando');
  });

  it('girar reducido no consume el rng de las vueltas', () => {
    let n = 0;
    girar(ini(), ctx(), est, true, () => (n++, 0.5));
    expect(n).toBe(2);
  });

  it('girar mientras gira no hace nada', () => {
    const s = girar(ini(), ctx(), est, false, rng());
    expect(girar(s, ctx(), est, false, rng())).toBe(s);
  });

  it('todo sabido', () => {
    const s = girar(ini(), ctx(TODAS), est, false, rng());
    expect(s.contenido).toEqual({ tipo: 'todo-sabido' });
    expect(s.giro).toBeNull();
    expect(estadoPantalla(s)).toBe('inactivo');
  });

  it('la tarjeta previa se conserva durante el giro', () => {
    const s1 = conTarjeta();
    const s2 = girar(s1, ctx(), est, false, rng());
    expect(s2.contenido).toBe(s1.contenido);
    expect(s2.giro).not.toBeNull();
    expect(s2.ganador).toBeNull();
  });

  it('terminarGiro fija rot y muestra la tarjeta del tema ganador', () => {
    const g = girar(ini(), ctx(), est, false, rng());
    const s = terminarGiro(g, ctx(), est, false, rng());
    expect(s.giro).toBeNull();
    expect(s.rot).toBe(g.giro!.desde + g.giro!.delta);
    expect(s.ganador).toBe(1);
    expect(s.contenido).toMatchObject({
      tipo: 'tarjeta',
      temaId: 't2',
      dada: false,
      marcarVisible: false,
      repaso: false,
    });
    expect(estadoPantalla(s)).toBe('mostrando');
  });

  it('terminarGiro sin giro no hace nada', () => {
    const s = ini();
    expect(terminarGiro(s, ctx(), est, false, rng())).toBe(s);
  });

  it('terminarGiro con indice fuera de la materia deja el giro terminado', () => {
    const s = { ...ini(), giro: { indice: 9, desde: 0, delta: 720, duracionMs: 1, conTic: false } };
    const r = terminarGiro(s, ctx(), est, false, rng());
    expect(r.rot).toBe(720);
    expect(r.contenido.tipo).toBe('vacio');
  });

  it('tema que quedo completo durante el giro vuelve a girar', () => {
    const g = girar(ini(), ctx(), est, false, rngSecuencia([0])); // t1
    expect(g.giro!.indice).toBe(0);
    const p = sabidas('a1', 'a2', 'a3');
    const s = terminarGiro(g, ctx(p), est, false, rngSecuencia([0]));
    expect(s.giro).not.toBeNull();
    expect(s.giro!.indice).not.toBe(0);
    expect(s.ganador).toBeNull();
    expect(s.rot).toBe(g.giro!.desde + g.giro!.delta);
  });

  it('otra de este tema: con tema completo gira; si no queda nada pasa a todo-sabido', () => {
    const s1 = conTarjeta(); // t1 -> a1
    expect(s1.contenido).toMatchObject({ temaId: 't1' });
    const p = sabidas('a1', 'a2', 'a3');
    const s2 = otraDelTema(s1, ctx(p), est, false, rngSecuencia([0]));
    expect(s2.giro).not.toBeNull();
    const s3 = otraDelTema(s1, ctx(TODAS), est, false, rngSecuencia([0]));
    expect(s3.contenido).toEqual({ tipo: 'todo-sabido' });
    expect(s3.giro).toBeNull();
  });

  it('otra de este tema saca otra pregunta del mismo tema', () => {
    const s1 = conTarjeta();
    const s2 = otraDelTema(s1, ctx(progresoVacio, 'a1'), est, false, rngSecuencia([0]));
    expect(s2.contenido).toMatchObject({ temaId: 't1', dada: false, marcarVisible: false });
    expect(s2.contenido).not.toEqual(s1.contenido);
  });

  it('otra de este tema no hace nada con giro en curso o sin tarjeta', () => {
    const g = girar(conTarjeta(), ctx(), est, false, rng());
    expect(otraDelTema(g, ctx(), est, false, rng())).toBe(g);
    const v = ini();
    expect(otraDelTema(v, ctx(), est, false, rng())).toBe(v);
  });

  it('terminarGiro inicia el historial con la primera pregunta', () => {
    const s = conTarjeta();
    expect(s.historial.items).toHaveLength(1);
    expect(s.historial).toMatchObject({ indice: 0 });
    expect(s.historial.items[0]).toMatchObject({ temaId: 't1' });
  });

  it('otra agrega al historial y anterior/otra navegan sin sortear de nuevo', () => {
    const s1 = conTarjeta();
    const id1 = (s1.contenido as { preguntaId: string }).preguntaId;
    const s2 = otraDelTema(s1, ctx(progresoVacio, id1), est, false, rngSecuencia([0]));
    const id2 = (s2.contenido as { preguntaId: string }).preguntaId;
    expect(id2).not.toBe(id1);
    expect(s2.historial.items.map((r) => r.preguntaId)).toEqual([id1, id2]);
    expect(s2.historial.indice).toBe(1);

    const atras = anterior(s2, ctx());
    expect(atras.contenido).toMatchObject({ preguntaId: id1, dada: false });
    expect(atras.historial.indice).toBe(0);
    expect(atras.estrategia).toBe(s2.estrategia);

    const sinRng = () => {
      throw new Error('no debe sortear');
    };
    const adelante = otraDelTema(atras, ctx(), est, false, sinRng);
    expect(adelante.contenido).toMatchObject({ preguntaId: id2 });
    expect(adelante.historial.items).toHaveLength(2);

    const s3 = otraDelTema(adelante, ctx(progresoVacio, id2), est, false, rngSecuencia([0]));
    expect(s3.historial.items).toHaveLength(3);
  });

  it('anterior no hace nada sin anterior, sin tarjeta o con giro', () => {
    const s = conTarjeta();
    expect(anterior(s, ctx())).toBe(s);
    const v = ini();
    expect(anterior(v, ctx())).toBe(v);
    const s2 = otraDelTema(s, ctx(progresoVacio, 'a1'), est, false, rngSecuencia([0]));
    const g = girar(s2, ctx(), est, false, rng());
    expect(anterior(g, ctx())).toBe(g);
  });

  it('al revisitar una pregunta marcada los botones de marca quedan visibles', () => {
    const s1 = conTarjeta();
    const id1 = (s1.contenido as { preguntaId: string }).preguntaId;
    const s2 = otraDelTema(s1, ctx(progresoVacio, id1), est, false, rngSecuencia([0]));
    const p = marcar(progresoVacio, id1, 'no');
    const atras = anterior(s2, ctx(p));
    expect(atras.contenido).toMatchObject({
      marcarVisible: true,
      repaso: true,
      falloContado: false,
    });
    const libre = anterior(s2, ctx());
    expect(libre.contenido).toMatchObject({ marcarVisible: false, repaso: false });
  });

  it('un giro nuevo descarta el historial anterior', () => {
    const s1 = otraDelTema(conTarjeta(), ctx(progresoVacio, 'a1'), est, false, rngSecuencia([0]));
    expect(s1.historial.items).toHaveLength(2);
    const g = girar(s1, ctx(), est, false, rngSecuencia([0.99]));
    const s2 = terminarGiro(g, ctx(), est, false, rngSecuencia([0]));
    expect(s2.historial.items).toHaveLength(1);
    expect(s2.historial.items[0]).toMatchObject({ temaId: 't3' });
  });

  it('voltear deja marcarVisible en true aunque se vuelva al frente', () => {
    const s0 = conTarjeta();
    expect(puedeMarcar(s0)).toBe(false);
    const s1 = voltear(s0);
    expect(s1.contenido).toMatchObject({ dada: true, marcarVisible: true });
    expect(puedeMarcar(s1)).toBe(true);
    const s2 = voltear(s1);
    expect(s2.contenido).toMatchObject({ dada: false, marcarVisible: true });
    expect(puedeMarcar(s2)).toBe(true);
  });

  it('voltear y puedeMarcar sin tarjeta no hacen nada', () => {
    const s = ini();
    expect(voltear(s)).toBe(s);
    expect(puedeMarcar(s)).toBe(false);
  });

  it('repaso se fija al mostrar y no cambia al marcar', () => {
    const p = marcar(progresoVacio, 'c1', 'no');
    const g = girar(ini(), ctx(p), est, false, rngSecuencia([0.99])); // t3
    const s = terminarGiro(g, ctx(p), est, false, rngSecuencia([0]));
    expect(s.contenido).toMatchObject({ temaId: 't3', preguntaId: 'c1', repaso: true });
    // marcar 'si' despues no toca la sesion: la foto sigue igual
    expect(voltear(s).contenido).toMatchObject({ repaso: true });
    // una pregunta sin marca no es repaso aunque luego se marque 'no'
    const s2 = conTarjeta();
    const pNo = marcar(progresoVacio, 'a1', 'no');
    expect(s2.contenido).toMatchObject({ repaso: false });
    expect(voltear(s2).contenido).toMatchObject({ repaso: false });
    expect(pNo.marcas).toEqual({ a1: 'no' });
  });

  it('mostrar sin pendientes llama a girar', () => {
    const s = mostrar(ini(), ctx(sabidas('c1')), est, 't3', false, rngSecuencia([0]));
    expect(s.giro).not.toBeNull();
    expect(s.giro!.indice).not.toBe(2);
  });

  it('alReiniciar apaga repaso y vacia mazos', () => {
    const p = marcar(progresoVacio, 'c1', 'no');
    const g = girar(ini(), ctx(p), est, false, rngSecuencia([0.99]));
    const s = terminarGiro(g, ctx(p), est, false, rngSecuencia([0]));
    expect(s.contenido).toMatchObject({ repaso: true });
    const r = alReiniciar(s, est);
    expect(r.contenido).toMatchObject({ repaso: false, preguntaId: 'c1' });
    expect(r.estrategia).toEqual({});
    const v = ini();
    expect(alReiniciar(v, est).contenido).toBe(v.contenido);
  });
});
