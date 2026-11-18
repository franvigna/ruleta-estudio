import { describe, expect, it } from 'vitest';
import { archivosHuerfanos, buscarLatex } from '../../scripts/lib/chequeos';

describe('buscarLatex', () => {
  it.each([
    'ganancia $70',
    'cota $82 cuando maxprofit era $40',
    '$80',
    'de $82 a $90',
    'costaba $80 y ahora $90, ahorro $10.',
    'rango $80-$90',
    '1\\) Identificar a, b y c. 2) Calcular',
    'ruta C:\\Users\\yo',
  ])('no marca moneda ni texto normal: %s', (texto) => {
    expect(buscarLatex(texto)).toEqual([]);
  });

  it.each([
    ['la formula $x^2$ es', '$x^2$'],
    ['vale $a_1 + b_1$ siempre', '$a_1 + b_1$'],
    ['sea $x$ un numero', '$x$'],
    ['con $f(x)$ continua', '$f(x)$'],
    ['bloque $$E = mc^2$$ listo', '$$E = mc^2$$'],
    ['abre \\(x\\)', '\\('],
    ['abre \\[x\\]', '\\['],
    ['\\frac{1}{2}', '\\frac'],
    ['\\sum_{i=1}^n i', '\\sum'],
    ['\\begin{align}', '\\begin'],
    ['el angulo \\alpha mide', '\\alpha'],
  ])('detecta LaTeX: %s', (texto, fragmento) => {
    const r = buscarLatex(texto);
    expect(r.length).toBeGreaterThan(0);
    expect(r.map((h) => h.fragmento)).toContain(fragmento);
  });

  it('detecta formula aunque haya montos en la misma linea', () => {
    const r = buscarLatex('pago $80 y $90 pero $x^2$ no');
    expect(r.map((h) => h.fragmento)).toEqual(['$x^2$']);
  });

  it('detecta $$ solo en una linea (bloque multilinea)', () => {
    const r = buscarLatex('texto\n$$\nx\n$$');
    expect(r.map((h) => h.linea)).toEqual([2, 4]);
  });

  it('informa el numero de linea (base 1) con CRLF', () => {
    const r = buscarLatex('uno\r\ndos $x^2$\r\ntres');
    expect(r).toEqual([{ linea: 2, fragmento: '$x^2$' }]);
  });
});

describe('archivosHuerfanos', () => {
  it('devuelve los archivos no referenciados, ordenados', () => {
    expect(archivosHuerfanos(['c.md', 'a.md', 'b.md'], ['b.md'])).toEqual(['a.md', 'c.md']);
  });

  it('devuelve vacio si todo esta referenciado', () => {
    expect(archivosHuerfanos(['a.md'], ['a.md', 'x.md'])).toEqual([]);
  });
});
