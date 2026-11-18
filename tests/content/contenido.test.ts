import { describe, expect, it } from 'vitest';
import { parsearArchivoTema } from '../../scripts/lib/contenido.ts';

const base = (cuerpo: string) => `---\ntema: t\n---\n\n${cuerpo}\n`;

describe('parsearArchivoTema', () => {
  it('lee dos preguntas bien formadas', () => {
    const r = parsearArchivoTema(
      base(
        '## P1\n<!-- id: a1 | tipo: teorica -->\n\nR1\n\n## P2\n<!-- id: a2 | tipo: reflexion | etiqueta: X -->\n\nR2',
      ),
      'x.md',
    );
    expect(r.problemas).toEqual([]);
    expect(r.preguntas.map((p) => p.id)).toEqual(['a1', 'a2']);
    expect(r.preguntas[1]?.etiqueta).toBe('X');
  });

  it('falla en vez de perder una pregunta con un encabezado "###"', () => {
    const r = parsearArchivoTema(
      base('## P1\n<!-- id: a1 | tipo: teorica -->\n\nR1\n\n### P2\n<!-- id: a2 | tipo: teorica -->\n\nR2'),
      'x.md',
    );
    expect(r.problemas.join('\n')).toMatch(/encabezado no soportado/);
  });

  it('falla con un encabezado "##" sin espacio', () => {
    const r = parsearArchivoTema(base('## P1\n<!-- id: a1 | tipo: teorica -->\n\nR1\n\n##P2'), 'x.md');
    expect(r.problemas.join('\n')).toMatch(/encabezado no soportado/);
  });

  it('falla con una cerca de codigo sin cerrar', () => {
    const r = parsearArchivoTema(
      base('## P1\n<!-- id: a1 | tipo: teorica -->\n\n```\ncodigo\n\n## P2\n<!-- id: a2 | tipo: teorica -->\n\nR2'),
      'x.md',
    );
    expect(r.problemas.join('\n')).toMatch(/sin cerrar/);
  });

  it('ignora "#" dentro de una cerca cerrada', () => {
    const r = parsearArchivoTema(
      base('## P1\n<!-- id: a1 | tipo: teorica -->\n\n```\n# comentario\n## no es pregunta\n```\n\nfin'),
      'x.md',
    );
    expect(r.problemas).toEqual([]);
    expect(r.preguntas).toHaveLength(1);
  });
});
