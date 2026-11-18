/** Generador de numeros en [0, 1). Inyectable para poder testear. */
export type Rng = () => number;

export function enteroAlAzar(rng: Rng, max: number): number {
  return Math.floor(rng() * max);
}

/** Fisher-Yates desde el final, igual al legacy. No muta la entrada. */
export function mezclar<T>(xs: readonly T[], rng: Rng): T[] {
  const m = [...xs];
  for (let i = m.length - 1; i > 0; i--) {
    const j = enteroAlAzar(rng, i + 1);
    const a = m[i] as T;
    m[i] = m[j] as T;
    m[j] = a;
  }
  return m;
}

/** Para tests: cicla los valores dados. */
export function rngSecuencia(valores: readonly number[]): Rng {
  let k = 0;
  return () => {
    const v = valores[k % valores.length] as number;
    k++;
    return v;
  };
}
