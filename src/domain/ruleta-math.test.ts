import {
  CENTRO,
  DURACION_MS,
  DURACION_REDUCIDA_MS,
  RADIO,
  anchoSegmento,
  easing,
  etiquetaSegmento,
  mod,
  pathSegmento,
  planificarGiro,
  puntoEnCircunferencia,
  rotacionEn,
  segmentoBajoPuntero,
  tonosSegmentos,
} from './ruleta-math';

// Copias literales del legacy (legacy/template.html)
const legacyPt = (ang: number, r: number) => {
  const a = ((ang - 90) * Math.PI) / 180;
  return [200 + r * Math.cos(a), 200 + r * Math.sin(a)];
};
const legacyBajo = (r: number, A: number, N: number) =>
  Math.floor((((-r % 360) + 360) % 360) / A) % N;
const legacyDelta = (vueltas: number, centro: number, rot: number) =>
  vueltas * 360 + ((((-centro - rot) % 360) + 360) % 360);

const rotaciones = [0, 10, -10, 359.9, -359.9, 360, -360, 725.5, -1234.5, 5000.1];

describe('constantes y utilidades', () => {
  it('expone constantes', () => {
    expect([CENTRO, RADIO, DURACION_MS, DURACION_REDUCIDA_MS]).toEqual([200, 190, 5200, 700]);
  });
  it('mod es no negativo', () => {
    expect(mod(-1, 360)).toBe(359);
    expect(mod(721, 360)).toBe(1);
  });
  it('anchoSegmento', () => {
    expect(anchoSegmento(18)).toBe(20);
  });
});

describe('puntoEnCircunferencia', () => {
  it('0 grados es arriba', () => {
    const [x, y] = puntoEnCircunferencia(0, 190);
    expect(x).toBeCloseTo(200, 9);
    expect(y).toBeCloseTo(10, 9);
  });
  it('coincide con el legacy', () => {
    for (const ang of [0, 33, 90, 180, 271.5, -45, 400]) {
      const [x, y] = puntoEnCircunferencia(ang, 190);
      const [lx, ly] = legacyPt(ang, 190);
      expect(x).toBe(lx);
      expect(y).toBe(ly);
    }
  });
});

describe('pathSegmento', () => {
  it('formato y coincidencia con el legacy', () => {
    for (const n of [18, 7]) {
      for (let i = 0; i < n; i++) {
        const A = 360 / n;
        const [x1, y1] = legacyPt(i * A, 190);
        const [x2, y2] = legacyPt((i + 1) * A, 190);
        expect(pathSegmento(i, n)).toBe(`M200 200 L${x1} ${y1} A190 190 0 0 1 ${x2} ${y2} Z`);
      }
    }
  });
  it('n=1 devuelve circulo completo con dos arcos de 180 grados', () => {
    const d = pathSegmento(0, 1);
    expect(d.match(/A190 190 0 0 1/g)).toHaveLength(2);
    expect(d).toMatch(/^M200 200 L200 10 A190 190 0 0 1 [\d.e-]+ 390 A190 190 0 0 1 200 10 Z$/);
  });
});

describe('segmentoBajoPuntero', () => {
  it('coincide con el legacy con rotaciones negativas y mayores a 360', () => {
    for (const n of [18, 7]) {
      for (const r of rotaciones) {
        expect(segmentoBajoPuntero(r, n)).toBe(legacyBajo(r, 360 / n, n));
      }
    }
  });
  it('valores concretos', () => {
    expect(segmentoBajoPuntero(0, 18)).toBe(0);
    expect(segmentoBajoPuntero(-25, 18)).toBe(1);
    expect(segmentoBajoPuntero(-745, 18)).toBe(1);
    expect(segmentoBajoPuntero(10, 18)).toBe(17);
  });
});

describe('easing', () => {
  it('extremos y medio', () => {
    expect(easing(0)).toBe(0);
    expect(easing(1)).toBe(1);
    expect(easing(0.5)).toBe(0.9375);
  });
});

describe('planificarGiro', () => {
  it('delta coincide con el legacy y cae en el segmento pedido', () => {
    const casos: [number, number, number, number][] = [
      [0, 0.5, 0, 18],
      [5, 0.3, 0.1, 18],
      [17, 0, 0.9, 18],
      [3, 0.999, 0.5, 7],
      [6, 0, 0.99, 7],
      [2, 0.5, 0.5, 7],
    ];
    for (const [idx, desvio, v, n] of casos) {
      for (const rot of rotaciones) {
        const seq = [desvio, v];
        let k = 0;
        const plan = planificarGiro(idx, n, rot, false, () => seq[k++] ?? 0);
        const A = 360 / n;
        const centro = idx * A + A / 2 + (desvio - 0.5) * A * 0.6;
        const vueltas = 5 + Math.floor(v * 3);
        expect(plan.delta).toBe(legacyDelta(vueltas, centro, rot));
        expect(plan.desde).toBe(rot);
        expect(segmentoBajoPuntero(plan.desde + plan.delta, n)).toBe(idx);
      }
    }
  });
  it('desvios extremos 0 y 0.999 aterrizan en el indice', () => {
    for (const n of [18, 7, 2, 1]) {
      for (let idx = 0; idx < n; idx++) {
        for (const d of [0, 0.999]) {
          for (const rot of rotaciones) {
            const plan = planificarGiro(idx, n, rot, false, () => d);
            expect(segmentoBajoPuntero(plan.desde + plan.delta, n)).toBe(idx);
          }
        }
      }
    }
  });
  it('vueltas 5, 6 y 7', () => {
    const delta = (v: number) => {
      const seq = [0.5, v];
      let k = 0;
      return planificarGiro(0, 18, 0, false, () => seq[k++] ?? 0).delta;
    };
    // centro = 10, rot 0 -> resto = 350
    expect(delta(0)).toBeCloseTo(5 * 360 + 350, 9);
    expect(delta(0.4)).toBeCloseTo(6 * 360 + 350, 9);
    expect(delta(0.999)).toBeCloseTo(7 * 360 + 350, 9);
  });
  it('normal: 5200 ms, con tic y dos consumos de rng', () => {
    const rng = vi.fn(() => 0.3);
    const plan = planificarGiro(1, 18, 0, false, rng);
    expect(plan.duracionMs).toBe(5200);
    expect(plan.conTic).toBe(true);
    expect(plan.indice).toBe(1);
    expect(rng).toHaveBeenCalledTimes(2);
  });
  it('reducido: 1 vuelta, 700 ms, sin tic y un solo consumo de rng', () => {
    const rng = vi.fn(() => 0.5);
    const plan = planificarGiro(0, 18, 0, true, rng);
    expect(plan.duracionMs).toBe(700);
    expect(plan.conTic).toBe(false);
    expect(rng).toHaveBeenCalledTimes(1);
    expect(plan.delta).toBeCloseTo(360 + 350, 9);
  });
  it('consume primero el desvio y despues las vueltas', () => {
    const seq = [0, 0.999];
    let k = 0;
    const plan = planificarGiro(0, 18, 0, false, () => seq[k++] ?? 0);
    // desvio 0 -> centro = 10 - 6 = 4; vueltas 7
    expect(plan.delta).toBeCloseTo(7 * 360 + 356, 9);
  });
});

describe('rotacionEn', () => {
  const plan = { indice: 0, desde: 100, delta: 1000, duracionMs: 1000, conTic: true };
  it('al inicio', () => {
    expect(rotacionEn(plan, 0)).toEqual({ rot: 100, terminado: false });
  });
  it('a mitad usa easing', () => {
    const r = rotacionEn(plan, 500);
    expect(r.rot).toBeCloseTo(100 + 1000 * 0.9375, 9);
    expect(r.terminado).toBe(false);
  });
  it('se recorta en u=1', () => {
    expect(rotacionEn(plan, 1000)).toEqual({ rot: 1100, terminado: true });
    expect(rotacionEn(plan, 99999)).toEqual({ rot: 1100, terminado: true });
  });
});

describe('etiquetaSegmento', () => {
  it('c < 180', () => {
    expect(etiquetaSegmento(0, 18)).toEqual({
      transform: 'rotate(-80 200 200)',
      x: 380,
      y: 204,
      anchor: 'end',
    });
    expect(etiquetaSegmento(8, 18).anchor).toBe('end'); // c = 170
  });
  it('c >= 180 (borde exacto con n=2)', () => {
    expect(etiquetaSegmento(1, 2)).toEqual({
      transform: 'rotate(360 200 200)',
      x: 20,
      y: 204,
      anchor: 'start',
    });
    expect(etiquetaSegmento(9, 18).transform).toBe('rotate(280 200 200)'); // c = 190
  });
});

describe('tonosSegmentos', () => {
  it('alterna dentro del area y reinicia al cambiar', () => {
    const temas = ['CC', 'CC', 'CC', 'DA', 'CC'].map((area) => ({ area }));
    expect(tonosSegmentos(temas)).toEqual(['base', 'suave', 'base', 'base', 'base']);
  });
  it('lista vacia', () => {
    expect(tonosSegmentos([])).toEqual([]);
  });
});
