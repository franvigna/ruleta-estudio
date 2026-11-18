import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { cargarMateria } from '../../scripts/lib/contenido.ts';
import { TEMA_LEGACY_A_NUEVO } from '../../scripts/lib/legacy-mapa.ts';

interface ItemLegacy {
  id: string;
  t: string;
  k: string;
  q: string;
  a: string;
  n: string;
  badge: string;
}
interface DataLegacy {
  topics: { id: string; name: string; short: string; area: string }[];
  items: ItemLegacy[];
}

const RAIZ = path.resolve(import.meta.dirname, '..', '..');
const legacy = JSON.parse(
  fs.readFileSync(path.join(RAIZ, 'legacy', 'data.json'), 'utf8'),
) as DataLegacy;
const materia = cargarMateria(path.join(RAIZ, 'content', 'materias', 'programacion-avanzada'));

const nuevas = materia.temas.flatMap((t) => t.preguntas.map((p) => ({ ...p, tema: t.id })));
const porId = new Map(nuevas.map((p) => [p.id, p]));

/** Enunciados reformulados a pedido explicito; el legacy conserva el texto original. */
const ENUNCIADOS_REFORMULADOS: Record<string, string> = {
  r2c47cda63c:
    '¿Qué tienen en común la búsqueda secuencial, los divisores, SAT y el ordenamiento por permutaciones como algoritmos de fuerza bruta?',
};

const BLOQUE = /^(p|ul|ol|li|table|th|td|tr|div|br|thead|tbody)$/;

function decodificar(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function textoVisible(html: string): string {
  const sinTags = html.replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (_m, tag: string) =>
    BLOQUE.test(tag.toLowerCase()) ? '\n' : '',
  );
  // Solo se colapsan espacios, tabs y saltos de linea comunes: un NBSP u otro espacio raro es una diferencia real.
  return decodificar(sinTags)
    .replace(/[ \t\r\n\f]+/g, ' ')
    .trim();
}

function secuenciaTags(html: string): string[] {
  const out: string[] = [];
  const re =
    /<(\/?)(p|ul|ol|li|table|th|td|tr|strong|em|b|div|code|pre|a|sup|sub|del|mark|span|blockquote|hr|img|br|h[1-6])\b([^>]*)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const [, cierre, tag, attrs] = m;
    if (tag === 'div') {
      if (!/class="tbl"/.test(attrs ?? '')) continue;
      out.push(`${cierre}div.tbl`);
    } else out.push(`${cierre}${tag}`);
  }
  return out;
}

describe('equivalencia con legacy/data.json', () => {
  it('mismos 331 ids, sin duplicados', () => {
    expect(legacy.items).toHaveLength(331);
    expect(nuevas).toHaveLength(331);
    expect(porId.size).toBe(331);
    expect(new Set(legacy.items.map((i) => i.id))).toEqual(new Set(nuevas.map((p) => p.id)));
  });

  it('18 temas en el mismo orden con mismo nombre, etiqueta corta y area', () => {
    expect(materia.temas).toHaveLength(18);
    expect(
      materia.temas.map((t) => [t.id, t.nombre, t.etiquetaCorta, t.area]),
    ).toEqual(
      legacy.topics.map((t) => [TEMA_LEGACY_A_NUEVO[t.id], t.name, t.short, t.area]),
    );
  });

  it('orden dentro de cada tema igual al de data.json', () => {
    for (const t of legacy.topics) {
      const esperado = legacy.items.filter((i) => i.t === t.id).map((i) => i.id);
      const real = materia.temas
        .find((x) => x.id === TEMA_LEGACY_A_NUEVO[t.id])
        ?.preguntas.map((p) => p.id);
      expect(real, t.id).toEqual(esperado);
    }
  });

  describe.each(legacy.items.map((i) => [i.id, i] as const))('%s', (_id, leg) => {
    const p = porId.get(leg.id);

    it('tema, tipo, etiqueta y nota', () => {
      expect(p).toBeDefined();
      expect(p?.tema).toBe(TEMA_LEGACY_A_NUEVO[leg.t]);
      const votacion = leg.q.includes('<ol class="opts">');
      expect(p?.tipo).toBe(leg.k === 'teo' ? 'teorica' : votacion ? 'votacion' : 'reflexion');
      expect(p?.etiqueta).toBe(leg.badge === '' ? undefined : leg.badge);
      expect(p?.nota).toBe(leg.n === '' ? undefined : leg.n);
    });

    it('enunciado: texto visible y estructura', () => {
      const esperado = ENUNCIADOS_REFORMULADOS[leg.id] ?? leg.q;
      expect(textoVisible(p?.enunciado ?? '')).toBe(textoVisible(esperado));
      expect(secuenciaTags(p?.enunciado ?? '')).toEqual(secuenciaTags(leg.q));
    });

    it('respuesta: texto visible y estructura', () => {
      expect(textoVisible(p?.respuesta ?? '')).toBe(textoVisible(leg.a));
      expect(secuenciaTags(p?.respuesta ?? '')).toEqual(secuenciaTags(leg.a));
    });
  });
});
