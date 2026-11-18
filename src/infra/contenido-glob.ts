import type { Cargador } from './contenido-repo';

/** Clave "../content/generated/<id>.json" -> id. */
export function indexarPorId(
  modulos: Readonly<Record<string, Cargador>>,
): Readonly<Record<string, Cargador>> {
  const salida: Record<string, Cargador> = {};
  for (const [ruta, cargador] of Object.entries(modulos)) {
    const nombre = ruta.split('/').pop() ?? ruta;
    salida[nombre.replace(/\.json$/, '')] = cargador;
  }
  return salida;
}

// Unico archivo con import.meta.glob. Sin coincidencias devuelve {}.
const materias = import.meta.glob<unknown>(
  ['../content/generated/*.json', '!../content/generated/catalogo.json'],
  { import: 'default' },
);
const catalogo = import.meta.glob<unknown>('../content/generated/catalogo.json', {
  import: 'default',
});

export const cargadoresGenerados = {
  catalogo: Object.values(catalogo)[0] ?? null,
  materias: indexarPorId(materias),
};
