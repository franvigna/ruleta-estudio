/**
 * Chequeos puros (sin fs) sobre el contenido.
 */

export interface HallazgoLatex {
  linea: number;
  fragmento: string;
}

/** Comandos TeX conocidos. Se listan para no marcar rutas como C:\Users. */
const COMANDOS_TEX = [
  'frac',
  'sum',
  'prod',
  'int',
  'sqrt',
  'lim',
  'infty',
  'partial',
  'nabla',
  'alpha',
  'beta',
  'gamma',
  'delta',
  'epsilon',
  'theta',
  'lambda',
  'mu',
  'pi',
  'sigma',
  'omega',
  'phi',
  'rho',
  'tau',
  'cdot',
  'times',
  'div',
  'pm',
  'leq',
  'geq',
  'neq',
  'approx',
  'equiv',
  'to',
  'rightarrow',
  'leftarrow',
  'Rightarrow',
  'mathbb',
  'mathrm',
  'mathbf',
  'text',
  'left',
  'right',
  'begin',
  'end',
  'overline',
  'underline',
  'vec',
  'hat',
  'forall',
  'exists',
  'in',
  'subset',
  'cup',
  'cap',
  'log',
  'ln',
  'sin',
  'cos',
  'tan',
];

const FUENTE_COMANDO = `\\\\(?:${COMANDOS_TEX.join('|')})(?![A-Za-z])`;
const FUENTE_DELIMITADOR = '\\\\[()\\[\\]]';

/**
 * Decide si el texto entre dos `$` parece una formula y no dos montos.
 * Reglas (inspiradas en las de Pandoc para $...$):
 *  - no vacio, sin espacio al inicio ni al final ("$82 a $90" -> "82 a " termina en espacio);
 *  - contiene un marcador de formula: `\`, `^`, `_`, `{`, `}`, `=`, `<`, `>`,
 *    o es una variable suelta ($x$) o una llamada f(x).
 */
function pareceFormula(contenido: string): boolean {
  if (contenido.length === 0 || /^\s|\s$/.test(contenido)) return false;
  if (/[\\^_{}=<>]/.test(contenido)) return true;
  if (/^[A-Za-z]$/.test(contenido)) return true;
  return /^[A-Za-z]\w*\([^)]*\)$/.test(contenido);
}

/**
 * Detecta notacion LaTeX. Heuristica por linea:
 *  1. `$$` (cualquier aparicion: bloque de formula).
 *  2. Delimitadores `\(`, `\)`, `\[`, `\]` (salvo `1\)` al inicio de linea: lista escapada).
 *  3. Comandos TeX conocidos (`\frac`, `\sum`, `\alpha`, `\begin{...`, etc.).
 *  4. Pares `$...$` cuyo contenido parece formula (ver pareceFormula). Los
 *     signos `$` usados como moneda no cuentan, aunque haya dos en la linea.
 */
export function buscarLatex(texto: string): HallazgoLatex[] {
  const hallazgos: HallazgoLatex[] = [];
  const lineas = texto.split(/\r?\n/);
  lineas.forEach((lineaOriginal, idx) => {
    const numero = idx + 1;
    // "1\) texto" es un marcador de lista Markdown escapado, no LaTeX.
    const linea = lineaOriginal.replace(/^(\s*\d+)\\\)/, '$1)');
    const encontrados: string[] = [];

    const dobles = linea.match(/\$\$[^$]*(?:\$\$)?/g);
    if (dobles) encontrados.push(...dobles);
    const sinDobles = linea.replace(/\$\$/g, '  ');

    const delim = linea.match(new RegExp(FUENTE_DELIMITADOR, 'g'));
    if (delim) encontrados.push(...delim);

    const cmd = linea.match(new RegExp(FUENTE_COMANDO, 'g'));
    if (cmd) encontrados.push(...cmd);

    let i = sinDobles.indexOf('$');
    while (i !== -1) {
      const j = sinDobles.indexOf('$', i + 1);
      if (j === -1) break;
      if (pareceFormula(sinDobles.slice(i + 1, j))) {
        encontrados.push(sinDobles.slice(i, j + 1));
        i = sinDobles.indexOf('$', j + 1);
      } else {
        i = j;
      }
    }

    for (const fragmento of encontrados) hallazgos.push({ linea: numero, fragmento });
  });
  return hallazgos;
}

/** Archivos que estan en disco pero ningun tema referencia, ordenados. */
export function archivosHuerfanos(
  archivosEnDisco: string[],
  archivosReferenciados: string[],
): string[] {
  const referenciados = new Set(archivosReferenciados);
  return archivosEnDisco.filter((a) => !referenciados.has(a)).sort();
}
