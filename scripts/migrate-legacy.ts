/**
 * Migra legacy/ (build_data.py) a content/materias/programacion-avanzada/.
 * Replica las reglas de build_data.py. Idempotente: reescribe la carpeta entera.
 *
 * Uso: npx tsx scripts/migrate-legacy.ts
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { TEMA_LEGACY_A_NUEVO } from './lib/legacy-mapa.ts';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DESTINO = path.join(RAIZ, 'content', 'materias', 'programacion-avanzada');

// ------------------------------------------------------------- Reglas legacy

/** quotes() de build_data.py: alternancia con estado que se reinicia en cada llamada. */
function quotes(s: string): string {
  let abre = true;
  let out = '';
  for (const ch of s) {
    if (ch === '"') {
      out += abre ? '“' : '”';
      abre = !abre;
    } else out += ch;
  }
  return out;
}

interface Bloque {
  h2: string | null;
  h3: string | null;
  q: string;
  body: string;
}

function bloques(file: string): Bloque[] {
  const out: Bloque[] = [];
  let h2: string | null = null;
  let h3: string | null = null;
  let q: string | null = null;
  let body: string[] = [];
  const lineas = [...fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n').split('\n'), '## END'];
  for (const line of lineas) {
    if (
      line.startsWith('#### ') ||
      line.startsWith('### ') ||
      line.startsWith('## ') ||
      line.trim() === '---'
    ) {
      if (q !== null) out.push({ h2, h3, q, body: body.join('\n').trim() });
      q = null;
      body = [];
      if (line.startsWith('#### ')) q = line.slice(5).trim();
      else if (line.startsWith('### ')) h3 = line.slice(4).trim();
      else if (line.startsWith('## ')) {
        h2 = line.slice(3).trim();
        h3 = null;
      }
    } else if (q !== null) body.push(line);
  }
  return out;
}

function topicTeo(num: string): string {
  const [c, s] = num.split('.').map(Number) as [number, number];
  if (c === 1) return 'fund';
  if (c === 2) return s <= 7 ? 'recur' : s <= 13 ? 'rel' : 'tm';
  if (c === 6) return s <= 10 ? 'grfund' : 'recorr';
  if (c === 7) return s <= 9 ? 'cam' : 'mst';
  if (c === 8) return s <= 10 ? 'col' : 'np';
  if (c === 9) return s <= 8 ? 'fb' : 'bt';
  const mapa: Record<number, string> = {
    3: 'dyc',
    4: 'heap',
    5: 'greedy',
    10: 'bb',
    11: 'pd1',
    12: 'pd2',
  };
  const r = mapa[c];
  assert(r, `capitulo sin tema: ${num}`);
  return r;
}

const SEC: Record<string, string> = {
  'Clase 1': 'fund',
  'Clase 3': 'dyc',
  'Clase 4': 'heap',
  'Clase 5': 'greedy',
  'Clase 10': 'bb',
  'Clase 11': 'pd1',
  'Clase 12': 'pd2',
};
const SUB: Record<string, string> = {
  'DA: Recursividad': 'recur',
  'CC: Relaciones de Recurrencia': 'rel',
  'CC: Teorema Maestro': 'tm',
  'GR: Fundamentos': 'grfund',
  'GR: Recorridos de Grafos': 'recorr',
  'GR: Caminos Mínimos': 'cam',
  'GR: Árboles Abarcadores': 'mst',
  'GR: Coloreo': 'col',
  'CC: Conceptos Avanzados': 'np',
  'DA: Fuerza Bruta': 'fb',
  'DA: Backtracking': 'bt',
};
const NOTE =
  'Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase.';
const COMPOSED: [string, string][] = [
  [
    '¿Por qué no utilizamos siempre',
    'La eficiencia no es el único criterio: además del tiempo y la memoria importan la claridad de la solución y la facilidad de codificación. Y "el mejor" depende del contexto: inserción gana con datos casi ordenados y selección cuando cada posición guarda mucha información; MergeSort garantiza O(n log n) pero necesita O(n) de memoria extra; y con entradas chicas la diferencia entre órdenes casi no importa, así que puede convenir lo más simple.',
  ],
  [
    '¿Cómo se calcula en forma teórica',
    'Contando operaciones elementales en función del tamaño de la entrada, sin ejecutar nada. Las sentencias simples cuestan una constante, una secuencia suma sus costos, un condicional cuesta la condición más la rama más cara y un bucle multiplica la cantidad de iteraciones por el costo del cuerpo (reglas de la suma y del producto). Con eso se arma T(n) y se expresa su orden con notación asintótica.',
  ],
  [
    '¿Y en forma empírica?',
    'Implementando el algoritmo y midiendo: se eligen entradas de tamaño creciente (duplicando cada vez), se ejecuta varias veces cada una, se promedia descartando las primeras corridas, y se grafica el tiempo contra el tamaño. Cómo cambia el tiempo al duplicar n muestra la complejidad. La desventaja es que hay que codificar y los resultados dependen de la máquina.',
  ],
  [
    '¿Puede resolverse exactamente el mismo problema',
    'Sí. Un mismo problema admite varios algoritmos, con distintas estrategias de diseño (fuerza bruta, división y conquista, greedy, programación dinámica, backtracking, ramificación y poda) y estructura iterativa o recursiva. Ordenar, por ejemplo, se resuelve con selección, inserción, MergeSort, QuickSort o HeapSort, con costos y propiedades distintas.',
  ],
  [
    '¿Cuáles eran las cuatro características',
    '**Sensible a la entrada**: su tiempo varía según cómo viene la entrada. **Estable**: conserva el orden original de los elementos con igual clave. **En línea**: puede procesar los datos a medida que llegan. **En el lugar**: ordena usando solo espacio adicional constante.',
  ],
  [
    'Pero… ¿cómo medimos el costo',
    'Planteando una **relación de recurrencia**: una ecuación que expresa T(n) en función del costo de instancias más chicas del mismo problema, con un caso base y un caso recursivo. Después se resuelve por telescopía, con un árbol de recursión o, si tiene la forma a·T(n/b) + nᶜ, con el Teorema Maestro.',
  ],
  [
    'La telescopía funciona bien',
    'Sí: el **Teorema Maestro**. Para recurrencias de la forma T(n) = a·T(n/b) + nᶜ alcanza con comparar logb(a) contra c para obtener el orden, sin hacer el desarrollo completo.',
  ],
];
const DYC: Record<string, string> = { '1.': '3.8', '2.': '3.10', '3.': '3.17', '5.': '2.20' };
const DYC4 =
  'Que ante dos elementos con la misma clave de ordenamiento se conserva su orden original. De los dos, **MergeSort** es estable: en la fusión, ante un empate toma primero el elemento de la mitad izquierda, que venía antes. QuickSort no es estable.';
const NOTA_VOTACION =
  'Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase.';

// ------------------------------------------------------------------- Modelo

interface Item {
  legacyTema: string;
  id: string;
  tipo: 'teorica' | 'reflexion' | 'votacion';
  /** Encabezado ya con comillas tipograficas (para votaciones: enunciado sin prefijo). */
  encabezado: string;
  opciones?: { letra: string; texto: string }[];
  cuerpo: string;
  etiqueta: string;
  nota: string;
}

const ajustes: string[] = [];

/** Escapes minimos para que CommonMark muestre el mismo texto que Python-Markdown. */
function escapar(id: string, cuerpo: string): string {
  const m = /^(\d+)\)/.exec(cuerpo);
  if (m) {
    ajustes.push(`${id}: cuerpo empieza con "${m[1]}) ": escapado como "${m[1]}\\)"`);
    return cuerpo.replace(/^(\d+)\)/, '$1\\)');
  }
  return cuerpo;
}

function construir(): Item[] {
  const items: Item[] = [];
  const teo = new Map<string, string>();

  for (const { q, body } of bloques(path.join(RAIZ, 'legacy', 'preguntas_teoricas.md'))) {
    const m = /^(\d+\.\d+)\s+(.*)$/.exec(q);
    assert(m, `teorica sin numero: ${q}`);
    const num = m[1] as string;
    let text = m[2] as string;
    const parcial = text.includes('(parcial)');
    text = text.replaceAll('(parcial)', '').trim();
    teo.set(num, body);
    items.push({
      legacyTema: topicTeo(num),
      id: 't' + num,
      tipo: 'teorica',
      encabezado: quotes(text),
      cuerpo: quotes(body),
      etiqueta: parcial ? 'Tomada en parciales' : '',
      nota: '',
    });
  }

  for (const { h2, h3, q, body: b } of bloques(
    path.join(RAIZ, 'legacy', 'preguntas_para_reflexionar.md'),
  )) {
    const cl = (h2 ?? '').split(':')[0] as string;
    const tp = SEC[cl] ?? (h3 !== null ? SUB[h3] : undefined);
    assert(tp, `reflexion sin tema: ${q}`);
    const text = q.replace(/^\d+\.\s+/, '');
    let body = b
      .split('\n')
      .filter((l) => !l.startsWith('*Sin respuesta'))
      .join('\n')
      .trim();
    let nota = '';
    let etiqueta = '';
    if (!body) {
      nota = NOTE;
      for (const [k, v] of COMPOSED) if (text.startsWith(k)) body = v;
      if (!body && tp === 'dyc') {
        const n = q.split(/\s+/)[0] as string;
        if (n === '4.') body = DYC4;
        else {
          const ref = DYC[n];
          assert(ref, `DyC sin referencia: ${q}`);
          body = teo.get(ref) as string;
        }
      }
    }
    assert(body, q);
    if (body.startsWith('*(De las diapositivas.)*')) {
      body = body.replace('*(De las diapositivas.)*', '').trim();
      etiqueta = 'Agregada desde las diapositivas';
    }
    const id = 'r' + createHash('md5').update(text, 'utf8').digest('hex').slice(0, 10);
    const item: Item = {
      legacyTema: tp,
      id,
      tipo: 'reflexion',
      encabezado: quotes(text),
      cuerpo: quotes(body),
      etiqueta,
      nota,
    };
    if (text.startsWith('Votación:')) {
      item.tipo = 'votacion';
      item.etiqueta = 'Votación de clase';
      item.nota = NOTA_VOTACION;
      const stem0 = text.slice('Votación:'.length).trim();
      const partes = (' ' + stem0).split(/\s([A-D])\)\s/);
      item.encabezado = quotes((partes[0] as string).trim());
      const opciones: { letra: string; texto: string }[] = [];
      for (let i = 1; i < partes.length; i += 2) {
        opciones.push({
          letra: partes[i] as string,
          texto: quotes((partes[i + 1] as string).trim()),
        });
      }
      item.opciones = opciones;
    }
    items.push(item);
  }
  return items;
}

// ------------------------------------------------------------------- Salida

function escribirPregunta(it: Item): string {
  const campos = [`id: ${it.id}`, `tipo: ${it.tipo}`];
  if (it.etiqueta) campos.push(`etiqueta: ${it.etiqueta}`);
  if (it.nota) campos.push(`nota: ${it.nota}`);
  let cuerpo = escapar(it.id, it.cuerpo);
  if (it.opciones) {
    cuerpo = it.opciones.map((o) => `- ${o.letra}) ${o.texto}`).join('\n') + '\n\n' + cuerpo;
  }
  return `## ${it.encabezado}\n<!-- ${campos.join(' | ')} -->\n\n${cuerpo}\n`;
}

const AREAS = [
  { id: 'CC', nombre: 'Complejidad', color: '#FFD84D', colorSuave: '#FFE993' },
  { id: 'DA', nombre: 'Diseño de algoritmos', color: '#6FD99A', colorSuave: '#B0EEC8' },
  { id: 'GR', nombre: 'Grafos', color: '#6CC4F2', colorSuave: '#AEDDF8' },
  { id: 'TDA', nombre: 'Estructuras', color: '#FF8FBF', colorSuave: '#FFC2DB' },
];

function main(): void {
  const data = JSON.parse(fs.readFileSync(path.join(RAIZ, 'legacy', 'data.json'), 'utf8')) as {
    topics: { id: string; name: string; short: string; area: string }[];
    items: { id: string; t: string }[];
  };
  const items = construir();

  fs.rmSync(DESTINO, { recursive: true, force: true });
  fs.mkdirSync(path.join(DESTINO, 'temas'), { recursive: true });

  const temas = data.topics.map((t) => {
    const nuevo = TEMA_LEGACY_A_NUEVO[t.id];
    assert(nuevo, `tema sin mapeo: ${t.id}`);
    return {
      id: nuevo,
      nombre: t.name,
      etiquetaCorta: t.short,
      area: t.area,
      archivo: `${nuevo}.md`,
    };
  });
  const materia = {
    id: 'programacion-avanzada',
    nombre: 'Programación Avanzada',
    descripcion:
      'Complejidad, diseño de algoritmos, grafos y estructuras de datos: preguntas teóricas y de reflexión de la cátedra de la UNLaM.',
    areas: AREAS,
    temas,
  };
  fs.writeFileSync(path.join(DESTINO, 'materia.json'), JSON.stringify(materia, null, 2) + '\n');

  console.log('tema: teoricas / reflexion');
  for (const t of data.topics) {
    const nuevo = TEMA_LEGACY_A_NUEVO[t.id] as string;
    const delTema = items.filter((i) => i.legacyTema === t.id);
    const ordenadas = [
      ...delTema.filter((i) => i.tipo === 'teorica'),
      ...delTema.filter((i) => i.tipo !== 'teorica'),
    ];
    const md = `---\ntema: ${nuevo}\n---\n\n${ordenadas.map(escribirPregunta).join('\n')}`;
    fs.writeFileSync(path.join(DESTINO, 'temas', `${nuevo}.md`), md);
    console.log(
      `${nuevo}: ${ordenadas.filter((i) => i.tipo === 'teorica').length} / ${ordenadas.filter((i) => i.tipo !== 'teorica').length}`,
    );
  }

  // Verificacion contra legacy/data.json
  assert.equal(items.length, data.items.length, 'cantidad de preguntas');
  assert.equal(new Set(items.map((i) => i.id)).size, items.length, 'ids repetidos');
  const esperados = new Map(data.items.map((i) => [i.id, i.t]));
  for (const it of items) {
    assert(esperados.has(it.id), `id no esta en data.json: ${it.id}`);
    assert.equal(esperados.get(it.id), it.legacyTema, `tema distinto para ${it.id}`);
  }
  console.log(
    `Total: ${items.length} preguntas, ${temas.length} temas. Ids verificados contra data.json.`,
  );
  console.log('Ajustes al Markdown fuente:');
  for (const a of ajustes) console.log('  ' + a);

  const gitkeep = path.join(RAIZ, 'content', '.gitkeep');
  if (fs.existsSync(gitkeep)) fs.rmSync(gitkeep);
}

main();
