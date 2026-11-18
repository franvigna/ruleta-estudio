import { mazosVacios, sacarDelMazo } from './mazo';
import { marcar, progresoVacio } from './progreso';
import { rngSecuencia } from './random';
import { materiaEjemplo, tema } from './testing/fixtures';

const t1 = materiaEjemplo().temas[0]!; // a1 a2 a3
const contador = () => {
  let n = 0;
  return {
    rng: () => {
      n++;
      return 0;
    },
    usos: () => n,
  };
};

describe('sacarDelMazo', () => {
  it('la primera extraccion mezcla y saca el ultimo', () => {
    // [a1,a2,a3]; i=2: j=0 -> [a3,a2,a1]; i=1: j=0 -> [a2,a3,a1]; pop = a1
    const r = sacarDelMazo(mazosVacios, t1, progresoVacio, null, rngSecuencia([0]))!;
    expect(r.preguntaId).toBe('a1');
    expect(r.mazos['t1']).toEqual(['a2', 'a3']);
    expect(mazosVacios).toEqual({});
  });

  it('las siguientes extracciones no consumen rng', () => {
    const r1 = sacarDelMazo(mazosVacios, t1, progresoVacio, null, rngSecuencia([0]))!;
    const c = contador();
    const r2 = sacarDelMazo(r1.mazos, t1, progresoVacio, r1.preguntaId, c.rng)!;
    expect(r2.preguntaId).toBe('a3');
    expect(c.usos()).toBe(0);
    const r3 = sacarDelMazo(r2.mazos, t1, progresoVacio, r2.preguntaId, c.rng)!;
    expect(r3.preguntaId).toBe('a2');
    expect(c.usos()).toBe(0);
  });

  it('filtra las si marcadas en el medio', () => {
    const r1 = sacarDelMazo(mazosVacios, t1, progresoVacio, null, rngSecuencia([0]))!;
    const p = marcar(progresoVacio, 'a3', 'si');
    const r2 = sacarDelMazo(r1.mazos, t1, p, 'a1', rngSecuencia([0]))!;
    expect(r2.preguntaId).toBe('a2');
    expect(r2.mazos['t1']).toEqual([]);
  });

  it('las no quedan en el mazo', () => {
    const r1 = sacarDelMazo(mazosVacios, t1, progresoVacio, null, rngSecuencia([0]))!;
    const p = marcar(progresoVacio, 'a3', 'no');
    const r2 = sacarDelMazo(r1.mazos, t1, p, 'a1', rngSecuencia([0]))!;
    expect(r2.preguntaId).toBe('a3');
  });

  it('al rearmar rota si el ultimo es la anterior', () => {
    // con rng 0 el mazo mezclado es [a2,a3,a1]: ultimo a1. anterior=a1 -> [a1,a2,a3], sale a3
    const r = sacarDelMazo(mazosVacios, t1, progresoVacio, 'a1', rngSecuencia([0]))!;
    expect(r.preguntaId).toBe('a3');
    expect(r.mazos['t1']).toEqual(['a1', 'a2']);
  });

  it('no rota si la anterior no es la ultima', () => {
    const r = sacarDelMazo(mazosVacios, t1, progresoVacio, 'a2', rngSecuencia([0]))!;
    expect(r.preguntaId).toBe('a1');
  });

  it('con un solo pendiente no rota: puede repetirse', () => {
    const t = tema('u', 'CC', ['z1']);
    const r = sacarDelMazo(mazosVacios, t, progresoVacio, 'z1', rngSecuencia([0]))!;
    expect(r.preguntaId).toBe('z1');
  });

  it('tema completo o sin preguntas devuelve null sin consumir rng', () => {
    const c = contador();
    let p = progresoVacio;
    for (const id of ['a1', 'a2', 'a3']) p = marcar(p, id, 'si');
    expect(sacarDelMazo(mazosVacios, t1, p, null, c.rng)).toBeNull();
    expect(sacarDelMazo(mazosVacios, tema('v', 'CC', []), progresoVacio, null, c.rng)).toBeNull();
    expect(c.usos()).toBe(0);
  });

  it('mazo con ids viejos todos sabidos se rearma', () => {
    const p = marcar(progresoVacio, 'a1', 'si');
    const r = sacarDelMazo({ t1: ['a1'] }, t1, p, null, rngSecuencia([0]))!;
    expect(['a2', 'a3']).toContain(r.preguntaId);
  });
});
