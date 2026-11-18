import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { crearMemoryRepo } from '../infra/memory-repo';
import { renderizarApp } from './testing/renderizar-app';

describe('flujo integrado de estudio', () => {
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
