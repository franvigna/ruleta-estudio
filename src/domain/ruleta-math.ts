import type { Rng } from './random';

/** Geometria y animacion de la ruleta (viewBox -10 -10 420 420). Formulas del legacy. */
export const CENTRO = 200;
export const RADIO = 190;
export const DURACION_MS = 5200;
export const DURACION_REDUCIDA_MS = 700;

export const mod = (a: number, m: number): number => ((a % m) + m) % m;

export const anchoSegmento = (n: number): number => 360 / n;

export function puntoEnCircunferencia(angDeg: number, r: number): readonly [number, number] {
  const a = ((angDeg - 90) * Math.PI) / 180;
  return [CENTRO + r * Math.cos(a), CENTRO + r * Math.sin(a)];
}

/**
 * Path del segmento i de n entre i*A y (i+1)*A (r = 190).
 * Con n === 1 el legacy no tenia caso: un unico arco de 360 grados tiene
 * inicio y fin iguales y SVG no lo dibuja, asi que se devuelven dos arcos de 180 grados.
 */
export function pathSegmento(i: number, n: number): string {
  const A = anchoSegmento(n);
  const [x1, y1] = puntoEnCircunferencia(i * A, RADIO);
  const head = `M${CENTRO} ${CENTRO} L${x1} ${y1}`;
  if (n === 1) {
    const [xm, ym] = puntoEnCircunferencia(180, RADIO);
    return `${head} A${RADIO} ${RADIO} 0 0 1 ${xm} ${ym} A${RADIO} ${RADIO} 0 0 1 ${x1} ${y1} Z`;
  }
  const [x2, y2] = puntoEnCircunferencia((i + 1) * A, RADIO);
  return `${head} A${RADIO} ${RADIO} 0 0 1 ${x2} ${y2} Z`;
}

export const segmentoBajoPuntero = (rot: number, n: number): number =>
  Math.floor(mod(-rot, 360) / anchoSegmento(n)) % n;

export const easing = (u: number): number => 1 - Math.pow(1 - u, 4);

export interface PlanGiro {
  readonly indice: number;
  readonly desde: number;
  readonly delta: number;
  readonly duracionMs: number;
  readonly conTic: boolean;
}

/** Consume el rng en este orden: primero el desvio, despues las vueltas (solo si !reducido). */
export function planificarGiro(
  indice: number,
  n: number,
  rotActual: number,
  reducido: boolean,
  rng: Rng,
): PlanGiro {
  const A = anchoSegmento(n);
  const centro = indice * A + A / 2 + (rng() - 0.5) * A * 0.6;
  const vueltas = reducido ? 1 : 5 + Math.floor(rng() * 3);
  const delta = vueltas * 360 + mod(-centro - rotActual, 360);
  return {
    indice,
    desde: rotActual,
    delta,
    duracionMs: reducido ? DURACION_REDUCIDA_MS : DURACION_MS,
    conTic: !reducido,
  };
}

export function rotacionEn(
  plan: PlanGiro,
  transcurridoMs: number,
): { rot: number; terminado: boolean } {
  const u = Math.min(1, transcurridoMs / plan.duracionMs);
  return { rot: plan.desde + plan.delta * easing(u), terminado: u >= 1 };
}

export interface Etiqueta {
  readonly transform: string;
  readonly x: number;
  readonly y: 204;
  readonly anchor: 'start' | 'end';
}

/** c = i*A + A/2. Si c < 180 la etiqueta va a la derecha del centro; si no, a la izquierda y rotada +90. */
export function etiquetaSegmento(i: number, n: number): Etiqueta {
  const A = anchoSegmento(n);
  const c = i * A + A / 2;
  if (c < 180)
    return { transform: `rotate(${c - 90} ${CENTRO} ${CENTRO})`, x: 380, y: 204, anchor: 'end' };
  return { transform: `rotate(${c + 90} ${CENTRO} ${CENTRO})`, x: 20, y: 204, anchor: 'start' };
}

/** Alterna 'base'/'suave' mientras temas consecutivos comparten area; al cambiar de area vuelve a 'base'. */
export function tonosSegmentos(temas: readonly { area: string }[]): readonly ('base' | 'suave')[] {
  let previa: string | null = null;
  let alt = 0;
  return temas.map((t) => {
    alt = t.area === previa ? 1 - alt : 0;
    previa = t.area;
    return alt === 0 ? 'base' : 'suave';
  });
}
