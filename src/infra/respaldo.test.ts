import { describe, expect, it } from 'vitest';
import { crearRespaldo, ErrorRespaldo, leerRespaldo } from './respaldo';

describe('respaldo', () => {
  it('ida y vuelta conserva marcas y fallos', () => {
    const progreso = { marcas: { a1: 'si', a2: 'no' }, fallos: { a2: 3 } } as const;
    const texto = crearRespaldo('demo', progreso);
    expect(texto).not.toContain('\n');
    expect(leerRespaldo(texto)).toEqual({ materiaId: 'demo', progreso });
  });

  it('sin fallos no escribe el campo', () => {
    const texto = crearRespaldo('demo', { marcas: { a1: 'si' } });
    expect(JSON.parse(texto).progreso).toEqual({ marcas: { a1: 'si' } });
  });

  it('tolera espacios alrededor y descarta marcas y fallos invalidos', () => {
    const texto = JSON.stringify({
      formato: 'ruleta-estudio-respaldo',
      version: 1,
      materiaId: 'demo',
      progreso: { marcas: { a1: 'si', a2: 'talvez' }, fallos: { a1: -1, a2: 2 } },
    });
    expect(leerRespaldo(`  \n${texto}\n `).progreso).toEqual({
      marcas: { a1: 'si' },
      fallos: { a2: 2 },
    });
  });

  it.each([
    ['', 'No hay nada para importar.'],
    ['no es json', 'El contenido no es un respaldo válido.'],
    ['{"otra":"cosa"}', 'El contenido no es un respaldo de Ruleta de Estudio.'],
    [
      '{"formato":"ruleta-estudio-respaldo","version":2,"materiaId":"d","progreso":{"marcas":{}}}',
      'El contenido no es un respaldo de Ruleta de Estudio.',
    ],
    ['x'.repeat(1_000_001), 'El archivo es demasiado grande.'],
  ])('rechaza contenido invalido %#', (texto, mensaje) => {
    expect(() => leerRespaldo(texto)).toThrow(ErrorRespaldo);
    expect(() => leerRespaldo(texto)).toThrow(mensaje);
  });
});
