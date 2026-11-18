/**
 * Los colores de area llegan desde materia.json. Se exponen como variables CSS
 * (--area-<id> y --area-<id>-2) en el contenedor de la materia; los componentes
 * nunca hardcodean colores de una materia.
 */

export interface AreaColores {
  readonly id: string;
  readonly color: string;
  readonly colorSuave: string;
}

export type VariablesDeAreas = Record<`--area-${string}`, string>;

export function variablesDeAreas(areas: readonly AreaColores[]): VariablesDeAreas {
  const vars: VariablesDeAreas = {};
  for (const a of areas) {
    vars[`--area-${a.id}`] = a.color;
    vars[`--area-${a.id}-2`] = a.colorSuave;
  }
  return vars;
}

/** Referencia CSS al color de un area: base o suave. */
export function varArea(areaId: string, suave = false): string {
  return `var(--area-${areaId}${suave ? '-2' : ''})`;
}
