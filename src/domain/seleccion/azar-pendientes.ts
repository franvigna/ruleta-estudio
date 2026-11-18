import { mazosVacios, sacarDelMazo, type Mazos } from '../mazo';
import { temaCompleto } from '../progreso';
import { enteroAlAzar } from '../random';
import type { ContextoSeleccion, EstrategiaSeleccion } from './estrategia';

function disponibles(ctx: ContextoSeleccion): readonly string[] {
  return ctx.materia.temas.filter((t) => !temaCompleto(t, ctx.progreso)).map((t) => t.id);
}

/** Estrategia del legacy: tema al azar entre los que tienen pendientes, mazo por tema. */
export const azarPendientes: EstrategiaSeleccion<Mazos> = {
  id: 'azar-pendientes',
  estadoInicial: () => mazosVacios,
  temasDisponibles: disponibles,
  elegirTema(ctx, rng) {
    const disp = disponibles(ctx);
    if (disp.length === 0) return null;
    return disp[enteroAlAzar(rng, disp.length)] ?? null;
  },
  sacarPregunta(ctx, estado, temaId, rng) {
    const tema = ctx.materia.temas.find((t) => t.id === temaId);
    if (!tema) return null;
    const r = sacarDelMazo(estado, tema, ctx.progreso, ctx.anteriorId, rng);
    return r && { preguntaId: r.preguntaId, estado: r.mazos };
  },
  alReiniciar: () => mazosVacios,
};
