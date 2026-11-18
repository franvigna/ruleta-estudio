import { enteroAlAzar, mezclar, rngSecuencia } from './random';

describe('random', () => {
  it('rngSecuencia cicla los valores', () => {
    const r = rngSecuencia([0.1, 0.2]);
    expect([r(), r(), r()]).toEqual([0.1, 0.2, 0.1]);
  });

  it('enteroAlAzar hace floor(rng*max)', () => {
    expect(enteroAlAzar(() => 0.99, 4)).toBe(3);
    expect(enteroAlAzar(() => 0, 4)).toBe(0);
  });

  it('mezclar da la permutacion esperada y no muta', () => {
    const xs = ['a', 'b', 'c', 'd'];
    // i=3: j=floor(0*4)=0 -> [d,b,c,a]; i=2: j=floor(.5*3)=1 -> [d,c,b,a]; i=1: j=floor(.99*2)=1 -> igual
    const r = mezclar(xs, rngSecuencia([0, 0.5, 0.99]));
    expect(r).toEqual(['d', 'c', 'b', 'a']);
    expect(xs).toEqual(['a', 'b', 'c', 'd']);
  });

  it('mezclar con listas de 0 o 1 elemento no consume rng', () => {
    const rng = vi.fn(() => 0.5);
    expect(mezclar([], rng)).toEqual([]);
    expect(mezclar([1], rng)).toEqual([1]);
    expect(rng).not.toHaveBeenCalled();
  });
});
