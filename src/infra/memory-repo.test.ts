import { crearMemoryRepo } from './memory-repo';
import { ErrorAlmacenamiento } from './progreso-repo';

describe('memory-repo', () => {
  it('cargar devuelve vacio o el inicial', async () => {
    const repo = crearMemoryRepo({ a: { marcas: { x: 'si' } } });
    expect(await repo.cargar('a')).toEqual({ marcas: { x: 'si' } });
    expect(await repo.cargar('b')).toEqual({ marcas: {} });
  });

  it('guarda y reinicia por materia', async () => {
    const repo = crearMemoryRepo();
    await repo.guardar('a', { marcas: { x: 'no' } });
    await repo.guardar('b', { marcas: { y: 'si' } });
    await repo.reiniciar('a');
    expect(await repo.cargar('a')).toEqual({ marcas: {} });
    expect(await repo.cargar('b')).toEqual({ marcas: { y: 'si' } });
  });

  it('fallarAlGuardar rechaza con ErrorAlmacenamiento y no guarda', async () => {
    const repo = crearMemoryRepo({}, { fallarAlGuardar: true });
    await expect(repo.guardar('a', { marcas: { x: 'si' } })).rejects.toBeInstanceOf(
      ErrorAlmacenamiento,
    );
    expect(await repo.cargar('a')).toEqual({ marcas: {} });
  });
});
