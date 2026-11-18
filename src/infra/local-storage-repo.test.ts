import {
  CLAVE_RESPALDO_V2,
  CLAVE_V2,
  crearLocalStorageRepo,
  leerAlmacenV2,
} from './local-storage-repo';
import { ErrorAlmacenamiento } from './progreso-repo';
import { crearAlmacenFalso } from './testing/almacen-falso';

const doc = (materias: Record<string, Record<string, unknown>>) =>
  JSON.stringify({
    version: 2,
    materias: Object.fromEntries(Object.entries(materias).map(([k, marcas]) => [k, { marcas }])),
  });

describe('local-storage-repo', () => {
  it('devuelve progreso vacio si no hay nada', async () => {
    const repo = crearLocalStorageRepo(crearAlmacenFalso());
    expect(await repo.cargar('a')).toEqual({ marcas: {} });
  });

  it('guarda y carga', async () => {
    const almacen = crearAlmacenFalso();
    const repo = crearLocalStorageRepo(almacen);
    await repo.guardar('a', { marcas: { 't1.1': 'si', r0a1b2c3d4: 'no' } });
    expect(await repo.cargar('a')).toEqual({ marcas: { 't1.1': 'si', r0a1b2c3d4: 'no' } });
    expect(JSON.parse(almacen.datos.get(CLAVE_V2) ?? '')).toEqual({
      version: 2,
      materias: { a: { marcas: { 't1.1': 'si', r0a1b2c3d4: 'no' } } },
    });
  });

  it('varias materias coexisten y guardar solo pisa la dada', async () => {
    const repo = crearLocalStorageRepo(crearAlmacenFalso());
    await repo.guardar('a', { marcas: { x: 'si' } });
    await repo.guardar('b', { marcas: { y: 'no' } });
    await repo.guardar('a', { marcas: { x: 'no' } });
    expect(await repo.cargar('a')).toEqual({ marcas: { x: 'no' } });
    expect(await repo.cargar('b')).toEqual({ marcas: { y: 'no' } });
  });

  it('reiniciar borra solo la materia dada', async () => {
    const repo = crearLocalStorageRepo(crearAlmacenFalso());
    await repo.guardar('a', { marcas: { x: 'si' } });
    await repo.guardar('b', { marcas: { y: 'no' } });
    await repo.reiniciar('a');
    expect(await repo.cargar('a')).toEqual({ marcas: {} });
    expect(await repo.cargar('b')).toEqual({ marcas: { y: 'no' } });
  });

  it('descarta marcas invalidas al cargar', async () => {
    const almacen = crearAlmacenFalso({
      datos: { [CLAVE_V2]: doc({ a: { x: 'si', y: 'quizas', z: 3, w: 'no' } }) },
    });
    const repo = crearLocalStorageRepo(almacen);
    expect(await repo.cargar('a')).toEqual({ marcas: { x: 'si', w: 'no' } });
  });

  it('getItem que lanza -> progreso vacio', async () => {
    const repo = crearLocalStorageRepo(crearAlmacenFalso({ lanzarEnGet: true }));
    expect(await repo.cargar('a')).toEqual({ marcas: {} });
  });

  it('JSON invalido o de forma inesperada -> progreso vacio', async () => {
    for (const basura of ['{no es json', '[]', '{"version":1,"materias":{}}']) {
      const repo = crearLocalStorageRepo(crearAlmacenFalso({ datos: { [CLAVE_V2]: basura } }));
      expect(await repo.cargar('a')).toEqual({ marcas: {} });
    }
  });

  it('guardar reemplaza un v2 corrupto', async () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V2]: '{corrupto' } });
    const repo = crearLocalStorageRepo(almacen);
    await repo.guardar('a', { marcas: { x: 'si' } });
    expect(await repo.cargar('a')).toEqual({ marcas: { x: 'si' } });
  });

  it('setItem que lanza -> rechaza con ErrorAlmacenamiento', async () => {
    const repo = crearLocalStorageRepo(crearAlmacenFalso({ lanzarEnSet: true }));
    await expect(repo.guardar('a', { marcas: { x: 'si' } })).rejects.toBeInstanceOf(
      ErrorAlmacenamiento,
    );
    await expect(repo.reiniciar('a')).rejects.toBeInstanceOf(ErrorAlmacenamiento);
  });

  it('leerAlmacenV2: null si falta, lanza si es invalido', () => {
    expect(leerAlmacenV2(crearAlmacenFalso())).toBeNull();
    expect(() => leerAlmacenV2(crearAlmacenFalso({ datos: { [CLAVE_V2]: '{x' } }))).toThrow();
  });

  describe('aislamiento entre materias y respaldo', () => {
    it('una entrada mal formada de otra materia no afecta a las demas', async () => {
      const texto = JSON.stringify({
        version: 2,
        materias: { rota: { marcas: 'x' }, a: { marcas: { x: 'si' } } },
      });
      const repo = crearLocalStorageRepo(crearAlmacenFalso({ datos: { [CLAVE_V2]: texto } }));
      expect(await repo.cargar('a')).toEqual({ marcas: { x: 'si' } });
      expect(await repo.cargar('rota')).toEqual({ marcas: {} });
    });

    it('guardar conserva tal cual las entradas ajenas, aunque esten mal formadas', async () => {
      const texto = JSON.stringify({
        version: 2,
        materias: { rota: { marcas: 'x' }, b: { marcas: { y: 'no', z: 'quizas' } } },
      });
      const almacen = crearAlmacenFalso({ datos: { [CLAVE_V2]: texto } });
      await crearLocalStorageRepo(almacen).guardar('a', { marcas: { x: 'si' } });
      expect(JSON.parse(almacen.datos.get(CLAVE_V2) ?? '')).toEqual({
        version: 2,
        materias: {
          rota: { marcas: 'x' },
          b: { marcas: { y: 'no', z: 'quizas' } },
          a: { marcas: { x: 'si' } },
        },
      });
      expect(almacen.datos.has(CLAVE_RESPALDO_V2)).toBe(false);
    });

    it('version futura: cargar no escribe; guardar respalda el texto crudo', async () => {
      const futuro = '{"version":3,"materias":{"a":{"marcas":{"x":"si"}}}}';
      const almacen = crearAlmacenFalso({ datos: { [CLAVE_V2]: futuro } });
      const repo = crearLocalStorageRepo(almacen);
      expect(await repo.cargar('a')).toEqual({ marcas: {} });
      expect(almacen.datos.get(CLAVE_V2)).toBe(futuro);
      expect(almacen.datos.has(CLAVE_RESPALDO_V2)).toBe(false);
      await repo.guardar('a', { marcas: { q: 'no' } });
      expect(almacen.datos.get(CLAVE_RESPALDO_V2)).toBe(futuro);
      expect(await repo.cargar('a')).toEqual({ marcas: { q: 'no' } });
    });

    it('JSON corrupto: respaldos sucesivos no se pisan', async () => {
      const almacen = crearAlmacenFalso({ datos: { [CLAVE_V2]: '{corrupto1' } });
      const repo = crearLocalStorageRepo(almacen);
      await repo.guardar('a', { marcas: { x: 'si' } });
      almacen.datos.set(CLAVE_V2, '{corrupto2');
      await repo.guardar('a', { marcas: { x: 'si' } });
      almacen.datos.set(CLAVE_V2, '{corrupto3');
      await repo.reiniciar('a');
      expect(almacen.datos.get(CLAVE_RESPALDO_V2)).toBe('{corrupto1');
      expect(almacen.datos.get(`${CLAVE_RESPALDO_V2}-2`)).toBe('{corrupto2');
      expect(almacen.datos.get(`${CLAVE_RESPALDO_V2}-3`)).toBe('{corrupto3');
    });

    it('si el respaldo falla no escribe y rechaza con ErrorAlmacenamiento', async () => {
      const almacen = crearAlmacenFalso({ datos: { [CLAVE_V2]: '{corrupto' } });
      const original = almacen.setItem.bind(almacen);
      almacen.setItem = (k, v) => {
        if (k.startsWith(CLAVE_RESPALDO_V2)) throw new Error('sin espacio');
        original(k, v);
      };
      await expect(
        crearLocalStorageRepo(almacen).guardar('a', { marcas: { x: 'si' } }),
      ).rejects.toBeInstanceOf(ErrorAlmacenamiento);
      expect(almacen.datos.get(CLAVE_V2)).toBe('{corrupto');
    });
  });

  it('dos pestanas sobre el mismo almacen no pierden marcas; lo de p gana', async () => {
    const almacen = crearAlmacenFalso();
    const pestana1 = crearLocalStorageRepo(almacen);
    const pestana2 = crearLocalStorageRepo(almacen);
    await pestana1.guardar('a', { marcas: { x: 'si', w: 'si' } });
    await pestana2.guardar('a', { marcas: { y: 'no', w: 'no' } });
    expect(await pestana1.cargar('a')).toEqual({ marcas: { x: 'si', y: 'no', w: 'no' } });
  });
});
