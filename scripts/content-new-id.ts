import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIPOS_PREGUNTA, type TipoPreguntaContenido } from '../src/content/schema';
import { ErrorContenido, cargarMateria, listarMaterias } from './lib/contenido';
import { sugerirId } from './lib/nuevo-id';

const dirMaterias = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'materias');

function uso(motivo?: string): never {
  if (motivo) console.error(motivo);
  console.error('Uso: npm run content:new-id -- <materia> <tema> [teorica|reflexion|votacion]');
  console.error('Materias y temas disponibles:');
  for (const id of listarMaterias(dirMaterias)) {
    try {
      const m = cargarMateria(join(dirMaterias, id));
      console.error(`  ${id}: ${m.temas.map((t) => t.id).join(', ')}`);
    } catch {
      console.error(`  ${id}: (contenido con errores)`);
    }
  }
  process.exit(1);
}

const [materiaId, temaId, tipoArg = 'teorica'] = process.argv.slice(2);
if (!materiaId || !temaId) uso();
if (!listarMaterias(dirMaterias).includes(materiaId)) uso(`Materia inexistente: ${materiaId}`);
if (!(TIPOS_PREGUNTA as readonly string[]).includes(tipoArg)) uso(`Tipo invalido: ${tipoArg}`);

try {
  const materia = cargarMateria(join(dirMaterias, materiaId));
  if (!materia.temas.some((t) => t.id === temaId)) uso(`Tema inexistente: ${temaId}`);
  console.log(sugerirId(materia, temaId, tipoArg as TipoPreguntaContenido));
} catch (e) {
  if (e instanceof ErrorContenido) {
    for (const p of e.problemas) console.error(p);
    process.exit(1);
  }
  throw e;
}
