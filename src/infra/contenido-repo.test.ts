import { crearContenidoRepo, ErrorContenido } from './contenido-repo';
import { indexarPorId } from './contenido-glob';

const materiaValida = (id = 'mat-a') => ({
  id,
  nombre: 'Materia A',
  descripcion: 'Desc',
  areas: [{ id: 'AA', nombre: 'Area', color: '#112233', colorSuave: '#445566' }],
  temas: [
    {
      id: 'tema-uno',
      nombre: 'Tema uno',
      etiquetaCorta: 'T1',
      area: 'AA',
      preguntas: [{ id: 'p1', tipo: 'teorica', enunciado: '<p>E</p>', respuesta: '<p>R</p>' }],
    },
  ],
});

const catalogoValido = [
  { id: 'mat-a', nombre: 'A', descripcion: 'D', cantidadTemas: 1, cantidadPreguntas: 1 },
];

describe('contenido-repo', () => {
  it('devuelve el catalogo valido', async () => {
    const repo = crearContenidoRepo({
      catalogo: () => Promise.resolve(catalogoValido),
      materias: {},
    });
    expect(await repo.catalogo()).toEqual(catalogoValido);
  });

  it('catalogo null -> ErrorContenido con instruccion', async () => {
    const repo = crearContenidoRepo({ catalogo: null, materias: {} });
    await expect(repo.catalogo()).rejects.toThrow(
      new ErrorContenido('Falta generar el contenido: npm run content:build'),
    );
  });

  it('catalogo invalido -> ErrorContenido con path', async () => {
    const repo = crearContenidoRepo({
      catalogo: () => Promise.resolve([{ ...catalogoValido[0], cantidadTemas: 0 }]),
      materias: {},
    });
    const error = await repo.catalogo().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ErrorContenido);
    expect((error as Error).message).toContain('0.cantidadTemas');
  });

  it('devuelve una materia valida', async () => {
    const repo = crearContenidoRepo({
      catalogo: null,
      materias: { 'mat-a': () => Promise.resolve(materiaValida()) },
    });
    const m = await repo.materia('mat-a');
    expect(m?.temas[0]?.preguntas[0]?.id).toBe('p1');
  });

  it('materia inexistente -> null (incluida una clave heredada de Object)', async () => {
    const repo = crearContenidoRepo({ catalogo: null, materias: {} });
    expect(await repo.materia('nada')).toBeNull();
    expect(await repo.materia('toString')).toBeNull();
  });

  it('JSON invalido -> ErrorContenido con el path del issue', async () => {
    const roto = materiaValida();
    roto.temas[0]!.preguntas[0]!.enunciado = '';
    const repo = crearContenidoRepo({
      catalogo: null,
      materias: { 'mat-a': () => Promise.resolve(roto) },
    });
    const error = await repo.materia('mat-a').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ErrorContenido);
    expect((error as Error).message).toContain('temas.0.preguntas.0.enunciado');
  });

  it('id que no coincide con la clave -> ErrorContenido', async () => {
    const repo = crearContenidoRepo({
      catalogo: null,
      materias: { 'mat-a': () => Promise.resolve(materiaValida('mat-b')) },
    });
    await expect(repo.materia('mat-a')).rejects.toBeInstanceOf(ErrorContenido);
  });

  it('cachea: el cargador se llama una sola vez', async () => {
    const cargadorMateria = vi.fn(() => Promise.resolve(materiaValida()));
    const cargadorCatalogo = vi.fn(() => Promise.resolve(catalogoValido));
    const repo = crearContenidoRepo({
      catalogo: cargadorCatalogo,
      materias: { 'mat-a': cargadorMateria },
    });
    const [a, b] = await Promise.all([repo.materia('mat-a'), repo.materia('mat-a')]);
    await repo.materia('mat-a');
    await repo.catalogo();
    await repo.catalogo();
    expect(a).toBe(b);
    expect(cargadorMateria).toHaveBeenCalledTimes(1);
    expect(cargadorCatalogo).toHaveBeenCalledTimes(1);
  });
});

describe('indexarPorId', () => {
  it('usa el nombre de archivo sin .json como id', () => {
    const f = () => Promise.resolve(1);
    const g = () => Promise.resolve(2);
    expect(
      indexarPorId({ '../content/generated/mat-a.json': f, '../content/generated/mat-b.json': g }),
    ).toEqual({ 'mat-a': f, 'mat-b': g });
    expect(indexarPorId({})).toEqual({});
  });
});
