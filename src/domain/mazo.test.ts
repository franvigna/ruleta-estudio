import { mazosVacios, sacarDelMazo } from './mazo';
import { marcar, progresoVacio, registrarFallo } from './progreso';
import { rngSecuencia } from './random';
import { materiaEjemplo, tema } from './testing/fixtures';

const t1 = materiaEjemplo().temas[0]!; // a1 a2 a3

describe('sacarDelMazo ponderado', () => {
  it('elige por posicion ponderada y consume un valor de rng', () => {
    const rng = vi.fn(() => 0);
    const r = sacarDelMazo(mazosVacios, t1, progresoVacio, null, rng)!;
    expect(r.preguntaId).toBe('a1');
    expect(r.mazos).toBe(mazosVacios);
    expect(rng).toHaveBeenCalledTimes(1);
  });

  it('una pregunta con mas fallos ocupa una porcion mayor del pool', () => {
    let p = progresoVacio;
    p = registrarFallo(registrarFallo(registrarFallo(p, 'a2'), 'a2'), 'a2');
    // Pesos: a1=1, a2=4, a3=1. 0.2*6=1.2 cae en a2.
    expect(sacarDelMazo(mazosVacios, t1, p, null, () => 0.2)?.preguntaId).toBe('a2');
    // Sin ponderacion, el mismo valor cae en a1 (0.2*3=.6).
    expect(sacarDelMazo(mazosVacios, t1, progresoVacio, null, () => 0.2)?.preguntaId).toBe('a1');
  });

  it('evita repetir la anterior cuando hay alternativas', () => {
    expect(sacarDelMazo(mazosVacios, t1, progresoVacio, 'a1', () => 0)?.preguntaId).toBe('a2');
  });

  it('con un solo pendiente puede repetirlo', () => {
    const t = tema('u', 'CC', ['z1']);
    expect(sacarDelMazo(mazosVacios, t, progresoVacio, 'z1', () => 0)?.preguntaId).toBe('z1');
  });

  it('las no siguen disponibles y las si salen del pool', () => {
    let p = marcar(progresoVacio, 'a1', 'si');
    p = marcar(p, 'a2', 'no');
    expect(sacarDelMazo(mazosVacios, t1, p, null, () => 0)?.preguntaId).toBe('a2');
  });

  it('tema completo o sin preguntas devuelve null sin consumir rng', () => {
    const rng = vi.fn(() => 0);
    let p = progresoVacio;
    for (const id of ['a1', 'a2', 'a3']) p = marcar(p, id, 'si');
    expect(sacarDelMazo(mazosVacios, t1, p, null, rng)).toBeNull();
    expect(sacarDelMazo(mazosVacios, tema('v', 'CC', []), progresoVacio, null, rng)).toBeNull();
    expect(rng).not.toHaveBeenCalled();
  });

  it('el extremo alto del rng devuelve la ultima candidata', () => {
    expect(
      sacarDelMazo(mazosVacios, t1, progresoVacio, null, rngSecuencia([0.999]))?.preguntaId,
    ).toBe('a3');
  });
});
