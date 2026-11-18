import { CLAVE_V2, crearLocalStorageRepo } from './local-storage-repo';
import { CLAVE_RESPALDO_V1, CLAVE_V1, MATERIA_V1, migrarV1aV2 } from './migraciones';
import { crearAlmacenFalso } from './testing/almacen-falso';

const V1_REAL = '{"r":{"t7.2":"si","r0a1b2c3d4":"no"}}';

describe('migrarV1aV2', () => {
  it('sin v1 -> sin-datos y no escribe nada', () => {
    const almacen = crearAlmacenFalso();
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'sin-datos' });
    expect(almacen.datos.size).toBe(0);
  });

  it('migra el formato real del legacy y borra v1', async () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL } });
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'migrado', cantidad: 2 });
    expect(almacen.datos.has(CLAVE_V1)).toBe(false);
    const repo = crearLocalStorageRepo(almacen);
    expect(await repo.cargar(MATERIA_V1)).toEqual({ marcas: { 't7.2': 'si', r0a1b2c3d4: 'no' } });
  });

  it('ignora valores invalidos y conserva huerfanos', async () => {
    const almacen = crearAlmacenFalso({
      datos: { [CLAVE_V1]: '{"r":{"huerfano":"si","x":"quizas","y":1}}' },
    });
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'migrado', cantidad: 1 });
    expect(await crearLocalStorageRepo(almacen).cargar(MATERIA_V1)).toEqual({
      marcas: { huerfano: 'si' },
    });
  });

  it('merge con v2 existente: gana v2 y otras materias se conservan', async () => {
    const v2 = {
      version: 2,
      materias: {
        [MATERIA_V1]: { marcas: { 't7.2': 'no', otro: 'si' }, fallos: { 't7.2': 3 } },
        otra: { marcas: { z: 'si' } },
      },
    };
    const almacen = crearAlmacenFalso({
      datos: { [CLAVE_V1]: V1_REAL, [CLAVE_V2]: JSON.stringify(v2) },
    });
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'migrado', cantidad: 2 });
    const repo = crearLocalStorageRepo(almacen);
    expect(await repo.cargar(MATERIA_V1)).toEqual({
      marcas: { 't7.2': 'no', r0a1b2c3d4: 'no', otro: 'si' },
      fallos: { 't7.2': 3 },
    });
    expect(await repo.cargar('otra')).toEqual({ marcas: { z: 'si' } });
  });

  it('es idempotente', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL } });
    migrarV1aV2(almacen);
    const despues = almacen.datos.get(CLAVE_V2);
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'sin-datos' });
    expect(almacen.datos.get(CLAVE_V2)).toBe(despues);
  });

  it('v1 con JSON invalido o forma incorrecta -> invalido sin tocar nada', () => {
    for (const basura of ['{no json', '[]', '{"r":[]}', 'null', '1']) {
      const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: basura } });
      expect(migrarV1aV2(almacen)).toEqual({ estado: 'invalido' });
      expect(almacen.datos.get(CLAVE_V1)).toBe(basura);
      expect(almacen.datos.has(CLAVE_V2)).toBe(false);
    }
  });

  it('v2 con JSON invalido -> invalido y no se toca nada', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL, [CLAVE_V2]: '{corrupto' } });
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'invalido' });
    expect(almacen.datos.get(CLAVE_V1)).toBe(V1_REAL);
    expect(almacen.datos.get(CLAVE_V2)).toBe('{corrupto');
  });

  it('getItem que lanza -> error', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL }, lanzarEnGet: true });
    expect(migrarV1aV2(almacen).estado).toBe('error');
  });

  it('setItem que lanza -> error y v1 intacta', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL }, lanzarEnSet: true });
    expect(migrarV1aV2(almacen).estado).toBe('error');
    expect(almacen.datos.get(CLAVE_V1)).toBe(V1_REAL);
  });

  it('removeItem que lanza -> error; v2 escrito, v1 queda y reintento converge', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL }, lanzarEnRemove: true });
    expect(migrarV1aV2(almacen).estado).toBe('error');
    expect(almacen.datos.get(CLAVE_V1)).toBe(V1_REAL);
    const sano = crearAlmacenFalso({ datos: Object.fromEntries(almacen.datos) });
    expect(migrarV1aV2(sano)).toEqual({ estado: 'migrado', cantidad: 2 });
    expect(sano.datos.has(CLAVE_V1)).toBe(false);
  });

  it('almacen que miente (relectura no coincide) -> error y v1 NO se borra', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL }, ignorarSet: true });
    expect(migrarV1aV2(almacen).estado).toBe('error');
    expect(almacen.datos.get(CLAVE_V1)).toBe(V1_REAL);
  });

  it('almacen que persiste algo distinto -> error y v1 NO se borra', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL } });
    const original = almacen.setItem.bind(almacen);
    almacen.setItem = (k, v) => original(k, v.replace('"t7.2":"si"', '"t7.2":"no"'));
    expect(migrarV1aV2(almacen).estado).toBe('error');
    expect(almacen.datos.get(CLAVE_V1)).toBe(V1_REAL);
  });

  it('v1 sin clave r equivale a vacio: migra 0 marcas y borra v1', () => {
    const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: '{"x":1}' } });
    expect(migrarV1aV2(almacen)).toEqual({ estado: 'migrado', cantidad: 0 });
    expect(almacen.datos.has(CLAVE_V1)).toBe(false);
  });

  describe('conflictos', () => {
    const v2Conflicto = JSON.stringify({
      version: 2,
      materias: { [MATERIA_V1]: { marcas: { 't7.2': 'no' } } },
    });

    it('conflicto: respalda el v1 exacto, gana v2 y borra v1', () => {
      const almacen = crearAlmacenFalso({
        datos: { [CLAVE_V1]: V1_REAL, [CLAVE_V2]: v2Conflicto },
      });
      expect(migrarV1aV2(almacen)).toEqual({ estado: 'migrado', cantidad: 2 });
      expect(almacen.datos.get(CLAVE_RESPALDO_V1)).toBe(V1_REAL);
      expect(almacen.datos.has(CLAVE_V1)).toBe(false);
    });

    it('conflicto con respaldo previo usa -2', () => {
      const almacen = crearAlmacenFalso({
        datos: { [CLAVE_V1]: V1_REAL, [CLAVE_V2]: v2Conflicto, [CLAVE_RESPALDO_V1]: 'previo' },
      });
      migrarV1aV2(almacen);
      expect(almacen.datos.get(CLAVE_RESPALDO_V1)).toBe('previo');
      expect(almacen.datos.get(`${CLAVE_RESPALDO_V1}-2`)).toBe(V1_REAL);
    });

    it('sin conflicto (mismo valor o ids distintos) no hay respaldo', () => {
      const v2 = JSON.stringify({
        version: 2,
        materias: { [MATERIA_V1]: { marcas: { 't7.2': 'si', otro: 'no' } } },
      });
      const almacen = crearAlmacenFalso({ datos: { [CLAVE_V1]: V1_REAL, [CLAVE_V2]: v2 } });
      expect(migrarV1aV2(almacen).estado).toBe('migrado');
      expect(almacen.datos.has(CLAVE_RESPALDO_V1)).toBe(false);
    });

    it('respaldo que falla -> error y v1 intacta', () => {
      const almacen = crearAlmacenFalso({
        datos: { [CLAVE_V1]: V1_REAL, [CLAVE_V2]: v2Conflicto },
      });
      const original = almacen.setItem.bind(almacen);
      almacen.setItem = (k, v) => {
        if (k.startsWith(CLAVE_RESPALDO_V1)) throw new Error('sin espacio');
        original(k, v);
      };
      expect(migrarV1aV2(almacen).estado).toBe('error');
      expect(almacen.datos.get(CLAVE_V1)).toBe(V1_REAL);
      expect(almacen.datos.has(CLAVE_RESPALDO_V1)).toBe(false);
    });
  });
});
