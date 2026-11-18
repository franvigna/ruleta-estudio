import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CatalogoSchema, type CatalogoItem } from '../src/content/schema';
import { ErrorContenido, cargarMateria, listarMaterias } from './lib/contenido';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dirMaterias = join(raiz, 'content', 'materias');
const dirSalida = join(raiz, 'src', 'content', 'generated');

function main(): void {
  const ids = listarMaterias(dirMaterias);
  if (ids.length === 0) {
    throw new ErrorContenido([`No hay materias en ${dirMaterias} (se espera <id>/materia.json)`]);
  }

  const materias = ids.map((id) => cargarMateria(join(dirMaterias, id)));

  const catalogo: CatalogoItem[] = materias
    .map((m) => ({
      id: m.id,
      nombre: m.nombre,
      descripcion: m.descripcion,
      ...(m.ejemplo ? { ejemplo: true } : {}),
      cantidadTemas: m.temas.length,
      cantidadPreguntas: m.temas.reduce((acc, t) => acc + t.preguntas.length, 0),
    }))
    .sort(
      (a, b) =>
        Number(a.ejemplo ?? false) - Number(b.ejemplo ?? false) || a.nombre.localeCompare(b.nombre),
    );
  CatalogoSchema.parse(catalogo);

  mkdirSync(dirSalida, { recursive: true });
  for (const f of readdirSync(dirSalida)) {
    if (f.endsWith('.json')) rmSync(join(dirSalida, f));
  }
  for (const m of materias) {
    writeFileSync(join(dirSalida, `${m.id}.json`), JSON.stringify(m), 'utf8');
  }
  writeFileSync(join(dirSalida, 'catalogo.json'), JSON.stringify(catalogo), 'utf8');

  for (const c of catalogo) {
    console.log(`${c.id}: ${c.cantidadTemas} temas, ${c.cantidadPreguntas} preguntas`);
  }
  console.log(`OK: ${catalogo.length} materias generadas en src/content/generated`);
}

try {
  main();
} catch (e) {
  if (e instanceof ErrorContenido) {
    for (const p of e.problemas) console.error(p);
    process.exit(1);
  }
  throw e;
}
