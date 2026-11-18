import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MateriaFuenteSchema } from '../src/content/schema';
import { archivosHuerfanos, buscarLatex } from './lib/chequeos';
import { ErrorContenido, cargarMateria, listarMaterias } from './lib/contenido';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirMaterias = join(raiz, 'content', 'materias');

function referenciados(dirMateria: string): string[] {
  try {
    const json: unknown = JSON.parse(readFileSync(join(dirMateria, 'materia.json'), 'utf8'));
    const r = MateriaFuenteSchema.safeParse(json);
    return r.success ? r.data.temas.map((t) => t.archivo) : [];
  } catch {
    return [];
  }
}

function main(): number {
  const ids = listarMaterias(dirMaterias);
  if (ids.length === 0) {
    console.error(`No hay materias en ${dirMaterias}`);
    return 1;
  }
  let hayProblemas = false;
  let temas = 0;
  let preguntas = 0;

  for (const id of ids) {
    const dir = join(dirMaterias, id);
    const problemas: string[] = [];
    try {
      const m = cargarMateria(dir);
      temas += m.temas.length;
      preguntas += m.temas.reduce((acc, t) => acc + t.preguntas.length, 0);
    } catch (e) {
      if (e instanceof ErrorContenido) problemas.push(...e.problemas);
      else throw e;
    }

    const dirTemas = join(dir, 'temas');
    const enDisco = existsSync(dirTemas)
      ? readdirSync(dirTemas)
          .filter((f) => f.endsWith('.md'))
          .sort()
      : [];
    for (const h of archivosHuerfanos(enDisco, referenciados(dir))) {
      problemas.push(`temas/${h}: archivo huerfano (no esta en materia.json)`);
    }
    for (const f of enDisco) {
      const texto = readFileSync(join(dirTemas, f), 'utf8');
      for (const h of buscarLatex(texto)) {
        problemas.push(`temas/${f}:${h.linea}: LaTeX no soportado: ${h.fragmento}`);
      }
    }

    if (problemas.length > 0) {
      hayProblemas = true;
      console.error(`${id}:`);
      for (const p of problemas) console.error(`  ${p}`);
    }
  }

  if (hayProblemas) return 1;
  console.log(`OK: ${ids.length} materias, ${temas} temas, ${preguntas} preguntas`);
  return 0;
}

process.exit(main());
