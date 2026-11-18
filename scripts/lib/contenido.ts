import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import type { ZodError } from 'zod';
import {
  MateriaFuenteSchema,
  MateriaSchema,
  TIPOS_PREGUNTA,
  type MateriaContenido,
  type PreguntaContenido,
  type TipoPreguntaContenido,
} from '../../src/content/schema.ts';

export class ErrorContenido extends Error {
  problemas: string[];
  constructor(problemas: string[]) {
    super(
      `Contenido invalido (${problemas.length} problema${problemas.length === 1 ? '' : 's'}):\n` +
        problemas.map((p) => `  - ${p}`).join('\n'),
    );
    this.name = 'ErrorContenido';
    this.problemas = problemas;
  }
}

export function escaparHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const marked = new Marked({ gfm: true, breaks: false });

function renderMarkdown(src: string): string {
  const html = (marked.parse(src.trim(), { async: false }) as string).trim();
  return html
    .replace(/<table>/g, '<div class="tbl"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

// ------------------------------------------------------------ Parseo de temas

export interface PreguntaParseada {
  /** Encabezado tal cual (sin "## "). */
  encabezado: string;
  /** Linea (1-based) del encabezado en el archivo. */
  linea: number;
  id: string;
  tipo: TipoPreguntaContenido;
  etiqueta?: string;
  nota?: string;
  /** Solo votaciones. */
  opciones?: { letra: string; texto: string }[];
  /** Cuerpo (la respuesta, sin las opciones), recortado. */
  cuerpo: string;
}

export interface ArchivoTemaParseado {
  tema: string | undefined;
  preguntas: PreguntaParseada[];
  problemas: string[];
}

const CLAVES = new Set(['id', 'tipo', 'etiqueta', 'nota']);
const ID_PREGUNTA = /^[^\s|]+$/;

function parsearComentario(linea: string): { campos: Map<string, string>; errores: string[] } {
  const errores: string[] = [];
  const campos = new Map<string, string>();
  const m = /^<!--(.*)-->$/.exec(linea.trim());
  if (!m) return { campos, errores: ['comentario de metadatos malformado'] };
  for (const crudo of (m[1] ?? '').split(' | ')) {
    const i = crudo.indexOf(':');
    if (i < 0) {
      errores.push(`campo sin "clave: valor": "${crudo.trim()}"`);
      continue;
    }
    const clave = crudo.slice(0, i).trim();
    const valor = crudo.slice(i + 1).trim();
    if (!CLAVES.has(clave)) {
      errores.push(`clave desconocida "${clave}"`);
      continue;
    }
    if (campos.has(clave)) {
      errores.push(`clave repetida "${clave}"`);
      continue;
    }
    if (valor === '') {
      errores.push(`clave "${clave}" sin valor`);
      continue;
    }
    campos.set(clave, valor);
  }
  return { campos, errores };
}

/** Parsea un archivo de tema. `archivo` solo se usa en los mensajes. */
export function parsearArchivoTema(texto: string, archivo: string): ArchivoTemaParseado {
  const problemas: string[] = [];
  const normal = texto.replace(/\r\n?/g, '\n');
  let tema: string | undefined;
  let cuerpoTexto = normal;
  let offset = 0;
  try {
    const fm = matter(normal);
    cuerpoTexto = fm.content;
    offset = normal.split('\n').length - fm.content.split('\n').length;
    const t = (fm.data as Record<string, unknown>)['tema'];
    if (typeof t === 'string' && t !== '') tema = t;
    else if (t !== undefined) problemas.push(`${archivo}: el frontmatter "tema" debe ser texto`);
  } catch (e) {
    problemas.push(`${archivo}: frontmatter invalido (${(e as Error).message.split('\n')[0]})`);
  }
  const lineas = cuerpoTexto.split('\n');

  // Ubicar encabezados "## " fuera de cercas de codigo.
  const inicios: number[] = [];
  let cerca: string | null = null;
  lineas.forEach((l, i) => {
    const f = /^\s*(```|~~~)/.exec(l);
    if (f) {
      const marca = f[1] as string;
      if (cerca === null) cerca = marca;
      else if (cerca === marca) cerca = null;
      return;
    }
    if (cerca !== null) return;
    if (l.startsWith('## ')) inicios.push(i);
    else if (l.startsWith('#')) {
      // Evita perder preguntas en silencio: "### P" o "##P" se pegarian al cuerpo anterior.
      problemas.push(
        `${archivo}:${i + 1 + offset}: encabezado no soportado "${l.slice(0, 40)}": cada pregunta empieza con "## " (con espacio)`,
      );
    }
  });
  if (cerca !== null) {
    problemas.push(`${archivo}: hay una cerca de codigo (${cerca}) sin cerrar`);
  }

  const preguntas: PreguntaParseada[] = [];
  inicios.forEach((ini, n) => {
    const fin = inicios[n + 1] ?? lineas.length;
    const encabezado = (lineas[ini] as string).slice(3).trim();
    const linea = ini + 1 + offset;
    const donde = `${archivo}:${linea} ("${encabezado}")`;
    let j = ini + 1;
    while (j < fin && (lineas[j] as string).trim() === '') j++;
    if (j >= fin) {
      problemas.push(`${donde}: falta el comentario de metadatos <!-- id: ... | tipo: ... -->`);
      return;
    }
    const { campos, errores } = parsearComentario(lineas[j] as string);
    if (errores.length > 0) {
      for (const e of errores) problemas.push(`${donde}: ${e} (linea ${j + 1 + offset})`);
      return;
    }
    const id = campos.get('id');
    const tipo = campos.get('tipo');
    let ok = true;
    if (id === undefined) {
      problemas.push(`${donde}: falta el campo "id"`);
      ok = false;
    } else if (!ID_PREGUNTA.test(id)) {
      problemas.push(`${donde}: id invalido "${id}" (sin espacios ni "|")`);
      ok = false;
    }
    if (tipo === undefined) {
      problemas.push(`${donde}: falta el campo "tipo"`);
      ok = false;
    } else if (!(TIPOS_PREGUNTA as readonly string[]).includes(tipo)) {
      problemas.push(`${donde}: tipo invalido "${tipo}" (use ${TIPOS_PREGUNTA.join(' | ')})`);
      ok = false;
    }
    if (!ok) return;

    const cuerpoLineas = lineas.slice(j + 1, fin);
    const p: PreguntaParseada = {
      encabezado,
      linea,
      id: id as string,
      tipo: tipo as TipoPreguntaContenido,
      cuerpo: '',
    };
    const etiqueta = campos.get('etiqueta');
    const nota = campos.get('nota');
    if (etiqueta !== undefined) p.etiqueta = etiqueta;
    if (nota !== undefined) p.nota = nota;

    if (p.tipo === 'votacion') {
      let k = 0;
      while (k < cuerpoLineas.length && (cuerpoLineas[k] as string).trim() === '') k++;
      const opciones: { letra: string; texto: string }[] = [];
      while (k < cuerpoLineas.length) {
        const m = /^- ([A-Z])\) (.*\S)\s*$/.exec(cuerpoLineas[k] as string);
        if (!m) break;
        opciones.push({ letra: m[1] as string, texto: m[2] as string });
        k++;
      }
      const consecutivas = opciones.every((o, i) => o.letra === String.fromCharCode(65 + i));
      if (opciones.length < 2) {
        problemas.push(
          `${donde}: la votacion necesita al menos 2 opciones "- A) texto" al inicio del cuerpo`,
        );
      } else if (!consecutivas) {
        problemas.push(
          `${donde}: las letras de las opciones deben ser consecutivas desde A (hay ${opciones.map((o) => o.letra).join(', ')})`,
        );
      }
      p.opciones = opciones;
      p.cuerpo = cuerpoLineas.slice(k).join('\n').trim();
    } else {
      p.cuerpo = cuerpoLineas.join('\n').trim();
    }
    if (p.cuerpo === '') problemas.push(`${donde}: la respuesta esta vacia`);
    preguntas.push(p);
  });

  return { tema, preguntas, problemas };
}

function renderPregunta(p: PreguntaParseada): PreguntaContenido {
  let enunciado: string;
  if (p.tipo === 'votacion') {
    const lis = (p.opciones ?? [])
      .map((o) => `<li><b>${o.letra}</b> ${escaparHtml(o.texto)}</li>`)
      .join('');
    enunciado = `<p>${escaparHtml(p.encabezado)}</p><ol class="opts">${lis}</ol>`;
  } else {
    enunciado = renderMarkdown(p.encabezado);
  }
  const salida: PreguntaContenido = {
    id: p.id,
    tipo: p.tipo,
    enunciado,
    respuesta: renderMarkdown(p.cuerpo),
  };
  if (p.etiqueta !== undefined) salida.etiqueta = p.etiqueta;
  if (p.nota !== undefined) salida.nota = p.nota;
  return salida;
}

// ----------------------------------------------------------------- Materia

function mensajesZod(prefijo: string, error: ZodError): string[] {
  return error.issues.map((i) => {
    const ruta = i.path.length > 0 ? ` en "${i.path.join('.')}"` : '';
    return `${prefijo}${ruta}: ${i.message}`;
  });
}

function rutaCorta(p: string): string {
  return p.split(path.sep).join('/');
}

export function listarMaterias(raizMaterias: string): string[] {
  if (!fs.existsSync(raizMaterias)) return [];
  return fs
    .readdirSync(raizMaterias, { withFileTypes: true })
    .filter(
      (d) => d.isDirectory() && fs.existsSync(path.join(raizMaterias, d.name, 'materia.json')),
    )
    .map((d) => d.name)
    .sort();
}

export function cargarMateria(dirMateria: string): MateriaContenido {
  const problemas: string[] = [];
  const carpeta = path.basename(path.resolve(dirMateria));
  const rutaJson = path.join(dirMateria, 'materia.json');
  const nombreJson = rutaCorta(rutaJson);

  let crudo: unknown;
  try {
    crudo = JSON.parse(fs.readFileSync(rutaJson, 'utf8'));
  } catch (e) {
    const msg =
      (e as NodeJS.ErrnoException).code === 'ENOENT'
        ? 'no existe'
        : `JSON invalido (${(e as Error).message})`;
    throw new ErrorContenido([`${nombreJson}: ${msg}`]);
  }
  const fuente = MateriaFuenteSchema.safeParse(crudo);
  if (!fuente.success) throw new ErrorContenido(mensajesZod(nombreJson, fuente.error));
  const mf = fuente.data;

  if (mf.id !== carpeta) {
    problemas.push(
      `${nombreJson}: el id de la materia ("${mf.id}") debe coincidir con el nombre de su carpeta ("${carpeta}")`,
    );
  }
  const areas = new Set<string>();
  for (const a of mf.areas) {
    if (areas.has(a.id)) problemas.push(`${nombreJson}: area duplicada "${a.id}"`);
    areas.add(a.id);
  }

  const idsTema = new Set<string>();
  const idsPregunta = new Map<string, string>();
  const temas: MateriaContenido['temas'] = [];

  for (const t of mf.temas) {
    if (idsTema.has(t.id)) problemas.push(`${nombreJson}: id de tema duplicado "${t.id}"`);
    idsTema.add(t.id);
    if (!areas.has(t.area)) {
      problemas.push(`${nombreJson}: el tema "${t.id}" usa el area inexistente "${t.area}"`);
    }
    const rutaTema = path.join(dirMateria, 'temas', t.archivo);
    const nombreTema = rutaCorta(rutaTema);
    if (!fs.existsSync(rutaTema)) {
      problemas.push(
        `${nombreJson}: el tema "${t.id}" apunta a un archivo que no existe: ${nombreTema}`,
      );
      continue;
    }
    const parseado = parsearArchivoTema(fs.readFileSync(rutaTema, 'utf8'), nombreTema);
    problemas.push(...parseado.problemas);
    if (parseado.tema === undefined) {
      if (!parseado.problemas.some((p) => p.includes('frontmatter'))) {
        problemas.push(`${nombreTema}: falta "tema: ${t.id}" en el frontmatter`);
      }
    } else if (parseado.tema !== t.id) {
      problemas.push(
        `${nombreTema}: el frontmatter dice tema "${parseado.tema}" pero materia.json espera "${t.id}"`,
      );
    }
    if (parseado.preguntas.length === 0 && parseado.problemas.length === 0) {
      problemas.push(`${nombreTema}: el tema no tiene preguntas`);
    }
    for (const p of parseado.preguntas) {
      const previo = idsPregunta.get(p.id);
      if (previo !== undefined) {
        problemas.push(
          `${nombreTema}:${p.linea}: id de pregunta duplicado "${p.id}" (ya en ${previo})`,
        );
      } else {
        idsPregunta.set(p.id, `${nombreTema}:${p.linea}`);
      }
    }
    temas.push({
      id: t.id,
      nombre: t.nombre,
      etiquetaCorta: t.etiquetaCorta,
      area: t.area,
      preguntas: parseado.preguntas.map(renderPregunta),
    });
  }

  if (problemas.length > 0) throw new ErrorContenido(problemas);

  const materia: MateriaContenido = {
    id: mf.id,
    nombre: mf.nombre,
    descripcion: mf.descripcion,
    areas: mf.areas,
    temas,
  };
  if (mf.ejemplo !== undefined) materia.ejemplo = mf.ejemplo;
  const final = MateriaSchema.safeParse(materia);
  if (!final.success)
    throw new ErrorContenido(mensajesZod(`${nombreJson} (resultado)`, final.error));
  return final.data;
}
