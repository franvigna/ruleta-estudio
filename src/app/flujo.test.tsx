import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { crearMemoryRepo } from '../infra/memory-repo';
import { renderizarApp } from './testing/renderizar-app';

describe('flujo integrado de estudio', () => {
  it('superpone la tarjeta y permite volver a la ruleta al cerrar o girar de nuevo', async () => {
    const { user, animador } = renderizarApp({ ruta: '/materia/demo' });

    expect(await screen.findByRole('link', { name: 'Volver a las materias' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Progreso' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Activar tema oscuro' })).toBeInTheDocument();

    await user.click(await screen.findByRole('button', { name: 'Girar la ruleta' }));
    animador.avanzar(6000);

    expect(await screen.findByRole('dialog', { name: 'Pregunta de Tema Uno' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Ruleta' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cerrar tarjeta y volver a la ruleta' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Ruleta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver pregunta' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ver pregunta' }));
    expect(await screen.findByRole('dialog', { name: 'Pregunta de Tema Uno' })).toBeInTheDocument();
    expect(screen.getByText('Pregunta a1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cerrar tarjeta y volver a la ruleta' }));

    await user.click(screen.getByRole('button', { name: 'Girar la ruleta' }));
    animador.avanzar(6000);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Volver a girar la ruleta' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Ruleta' })).toBeInTheDocument();
  });

  it('entra desde el catalogo, gira, voltea y permite corregir la marca', async () => {
    const { user, animador, repositorio } = renderizarApp({ ruta: '/' });

    await user.click(await screen.findByRole('link', { name: /Demo/ }));
    expect(await screen.findByRole('heading', { name: 'Ruleta de Demo' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Girar la ruleta' }));
    expect(animador.pendientes()).toBe(1);
    animador.avanzar(6000);

    expect(await screen.findByText('Pregunta a1')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Me la sabía' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Tarjeta: tocá/ }));
    expect(screen.getByText('Respuesta a1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'No me la sabía' }));
    await waitFor(async () => {
      expect(await repositorio.cargar('demo')).toEqual({ marcas: { a1: 'no' }, fallos: { a1: 1 } });
    });
    expect(screen.getByText('Queda para repasar.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tarjeta/ })).toHaveAttribute('data-marca', 'no');

    await user.click(screen.getByRole('button', { name: 'No me la sabía' }));
    expect((await repositorio.cargar('demo')).fallos).toEqual({ a1: 1 });

    await user.click(screen.getByRole('button', { name: 'Me la sabía' }));
    await waitFor(async () => {
      expect((await repositorio.cargar('demo')).marcas).toEqual({ a1: 'si' });
    });
    expect(screen.getByText('Sale de la ruleta.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tarjeta/ })).toHaveAttribute('data-marca', 'si');
  });

  it('cierra la tarjeta 2,5 segundos despues de marcar y vuelve a la ruleta', async () => {
    const { user, animador, repositorio } = renderizarApp({ ruta: '/materia/demo' });
    await user.click(await screen.findByRole('button', { name: 'Girar la ruleta' }));
    animador.avanzar(6000);
    await user.click(await screen.findByRole('button', { name: /Tarjeta: tocá/ }));

    await user.click(screen.getByRole('button', { name: 'Me la sabía' }));
    await waitFor(async () => {
      expect((await repositorio.cargar('demo')).marcas).toEqual({ a1: 'si' });
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
      timeout: 4000,
    });
    expect(screen.getByRole('region', { name: 'Ruleta' })).toBeInTheDocument();
  }, 10000);

  it('no cierra la tarjeta si solo se da vuelta sin marcar', async () => {
    const { user, animador, repositorio } = renderizarApp({ ruta: '/materia/demo' });
    await user.click(await screen.findByRole('button', { name: 'Girar la ruleta' }));
    animador.avanzar(6000);
    await user.click(await screen.findByRole('button', { name: /Tarjeta: tocá/ }));
    await new Promise((r) => setTimeout(r, 2800));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect((await repositorio.cargar('demo')).marcas).toEqual({});
  }, 10000);

  it('navega entre las preguntas vistas y las descarta al girar de nuevo', async () => {
    const { user, animador, repositorio } = renderizarApp({ ruta: '/materia/demo' });
    await user.click(await screen.findByRole('button', { name: 'Girar la ruleta' }));
    animador.avanzar(6000);
    expect(await screen.findByText('Pregunta a1')).toBeInTheDocument();
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pregunta anterior' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Siguiente pregunta del mismo tema' }));
    expect(await screen.findByText('Pregunta a2')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Pregunta anterior' }));
    expect(screen.getByText('Pregunta a1')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Siguiente pregunta del mismo tema' }));
    expect(screen.getByText('Pregunta a2')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();

    // Sin marcar nada no queda progreso, y cerrar la tarjeta conserva la lista.
    expect((await repositorio.cargar('demo')).marcas).toEqual({});
    await user.click(screen.getByRole('button', { name: 'Cerrar tarjeta y volver a la ruleta' }));
    await user.click(screen.getByRole('button', { name: 'Ver pregunta' }));
    expect(screen.getByText('2 / 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Volver a girar la ruleta' }));
    animador.avanzar(6000);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pregunta anterior' })).not.toBeInTheDocument();
    expect(screen.queryByText(/\d \/ \d/)).not.toBeInTheDocument();
  });

  it('importa un codigo uniendo marcas: lo mal visto en alguno queda mal', async () => {
    const repositorio = crearMemoryRepo({ demo: { marcas: { a1: 'si', b1: 'no' } } });
    const { user } = renderizarApp({ ruta: '/materia/demo/progreso', repositorio });
    expect(await screen.findByRole('heading', { name: 'Tu progreso' })).toBeInTheDocument();

    const codigo = JSON.stringify({
      formato: 'ruleta-estudio-respaldo',
      version: 1,
      materiaId: 'demo',
      progreso: { marcas: { a1: 'no', a2: 'si', b1: 'si', zzz: 'si' } },
    });
    await user.click(screen.getByLabelText('Pegá acá el código del otro dispositivo'));
    await user.paste(codigo);
    await user.click(screen.getByRole('button', { name: 'Importar progreso' }));

    expect(screen.getByRole('status')).toHaveTextContent('Progreso importado.');
    await waitFor(async () => {
      expect((await repositorio.cargar('demo')).marcas).toEqual({ a1: 'no', a2: 'si', b1: 'no' });
    });
  });

  it('rechaza codigos de otra materia o invalidos sin tocar el progreso', async () => {
    const repositorio = crearMemoryRepo({ demo: { marcas: { a1: 'si' } } });
    const { user } = renderizarApp({ ruta: '/materia/demo/progreso', repositorio });
    expect(await screen.findByRole('heading', { name: 'Tu progreso' })).toBeInTheDocument();
    const campo = screen.getByLabelText('Pegá acá el código del otro dispositivo');

    await user.click(campo);
    await user.paste(
      JSON.stringify({
        formato: 'ruleta-estudio-respaldo',
        version: 1,
        materiaId: 'otra',
        progreso: { marcas: { a2: 'si' } },
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Importar progreso' }));
    expect(screen.getByRole('status')).toHaveTextContent('Ese código es de otra materia.');

    await user.clear(campo);
    await user.paste('basura');
    await user.click(screen.getByRole('button', { name: 'Importar progreso' }));
    expect(screen.getByRole('status')).toHaveTextContent('no es un respaldo válido');
    expect((await repositorio.cargar('demo')).marcas).toEqual({ a1: 'si' });
  });

  it('reinicia el progreso solamente después de la segunda confirmacion', async () => {
    const repositorio = crearMemoryRepo({ demo: { marcas: { a1: 'si', b1: 'no' } } });
    const { user } = renderizarApp({ ruta: '/materia/demo/progreso', repositorio });

    expect(await screen.findByRole('heading', { name: 'Tu progreso' })).toBeInTheDocument();
    const reiniciar = screen.getByRole('button', { name: 'Reiniciar progreso' });
    await user.click(reiniciar);
    expect((await repositorio.cargar('demo')).marcas).toEqual({ a1: 'si', b1: 'no' });

    await user.click(screen.getByRole('button', { name: /Seguro/ }));
    await waitFor(async () => {
      expect((await repositorio.cargar('demo')).marcas).toEqual({});
    });
    expect(screen.getByText('de la materia sabida').previousElementSibling).toHaveTextContent('0%');
  });
});
