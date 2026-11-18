import type { MateriaContenido, TipoPreguntaContenido } from '../../src/content/schema';

const PATRON_CLASE = /^t(\d+)\.(\d+)$/;

/**
 * Sugiere un id libre para una pregunta nueva.
 *  - teorica con ids t<clase>.<n> en el tema: t<clase mas frecuente en el tema>.<max subindice
 *    de esa clase en TODA la materia + 1> (empate: la clase menor). Basta con que algun id
 *    del tema siga el patron.
 *  - cualquier otro caso: <temaId>-<n>, menor n >= (preguntas del tema + 1) libre en la materia.
 */
export function sugerirId(
  materia: MateriaContenido,
  temaId: string,
  tipo: TipoPreguntaContenido,
): string {
  const tema = materia.temas.find((t) => t.id === temaId);
  if (!tema) throw new Error(`El tema "${temaId}" no existe en la materia "${materia.id}"`);

  const usados = new Set(materia.temas.flatMap((t) => t.preguntas.map((p) => p.id)));

  if (tipo === 'teorica') {
    const frecuencias = new Map<number, number>();
    for (const p of tema.preguntas) {
      const m = PATRON_CLASE.exec(p.id);
      if (m) frecuencias.set(Number(m[1]), (frecuencias.get(Number(m[1])) ?? 0) + 1);
    }
    const mejor = [...frecuencias.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
    if (mejor) {
      const clase = mejor[0];
      let max = 0;
      for (const id of usados) {
        const m = PATRON_CLASE.exec(id);
        if (m && Number(m[1]) === clase) max = Math.max(max, Number(m[2]));
      }
      let n = max + 1;
      while (usados.has(`t${clase}.${n}`)) n++;
      return `t${clase}.${n}`;
    }
  }

  let n = tema.preguntas.length + 1;
  while (usados.has(`${temaId}-${n}`)) n++;
  return `${temaId}-${n}`;
}
