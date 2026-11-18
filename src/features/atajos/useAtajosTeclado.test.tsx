import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAtajosTeclado, type AccionesAtajos } from './useAtajosTeclado';

function Arnes({ acciones }: { acciones: AccionesAtajos }) {
  useAtajosTeclado(acciones);
  return (
    <div>
      <button>boton</button>
      <a href="#x">link</a>
      <span data-testid="span">
        <b data-testid="dentro-de-boton" />
      </span>
      <button>
        <i data-testid="hijo-de-boton" />
      </button>
      <input aria-label="campo" />
    </div>
  );
}

function preparar() {
  const acciones = { girar: vi.fn(), voltear: vi.fn(), marcar: vi.fn() };
  const vista = render(<Arnes acciones={acciones} />);
  return { acciones, ...vista };
}

describe('useAtajosTeclado', () => {
  it('Espacio y Enter giran y hacen preventDefault fuera de botones y links', () => {
    const { acciones } = preparar();
    expect(fireEvent.keyDown(document.body, { key: ' ' })).toBe(false);
    expect(fireEvent.keyDown(document.body, { key: 'Enter' })).toBe(false);
    expect(acciones.girar).toHaveBeenCalledTimes(2);
  });

  it('Espacio y Enter funcionan con foco en otros elementos (input, span)', () => {
    const { acciones, getByLabelText, getByTestId } = preparar();
    fireEvent.keyDown(getByLabelText('campo'), { key: ' ' });
    fireEvent.keyDown(getByTestId('span'), { key: 'Enter' });
    expect(acciones.girar).toHaveBeenCalledTimes(2);
  });

  it('Espacio y Enter se ignoran con foco en button o a (incluidos hijos)', () => {
    const { acciones, getByText, getByTestId } = preparar();
    for (const el of [getByText('boton'), getByText('link'), getByTestId('hijo-de-boton')]) {
      expect(fireEvent.keyDown(el, { key: ' ' })).toBe(true);
      expect(fireEvent.keyDown(el, { key: 'Enter' })).toBe(true);
    }
    expect(acciones.girar).not.toHaveBeenCalled();
  });

  it('V, S y N funcionan siempre, en mayuscula y minuscula, incluso en botones', () => {
    const { acciones, getByText } = preparar();
    const boton = getByText('boton');
    fireEvent.keyDown(boton, { key: 'v' });
    fireEvent.keyDown(boton, { key: 'V' });
    expect(acciones.voltear).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(boton, { key: 's' });
    fireEvent.keyDown(document.body, { key: 'S' });
    expect(acciones.marcar).toHaveBeenNthCalledWith(1, 'si');
    expect(acciones.marcar).toHaveBeenNthCalledWith(2, 'si');
    fireEvent.keyDown(boton, { key: 'n' });
    fireEvent.keyDown(document.body, { key: 'N' });
    expect(acciones.marcar).toHaveBeenNthCalledWith(3, 'no');
    expect(acciones.marcar).toHaveBeenNthCalledWith(4, 'no');
    expect(acciones.girar).not.toHaveBeenCalled();
  });

  it.each(['ctrlKey', 'metaKey', 'altKey'] as const)('ignora todo con %s', (mod) => {
    const { acciones } = preparar();
    for (const key of [' ', 'Enter', 'v', 'V', 's', 'S', 'n', 'N']) {
      expect(fireEvent.keyDown(document.body, { key, [mod]: true })).toBe(true);
    }
    expect(acciones.girar).not.toHaveBeenCalled();
    expect(acciones.voltear).not.toHaveBeenCalled();
    expect(acciones.marcar).not.toHaveBeenCalled();
  });

  it('ignora otras teclas', () => {
    const { acciones } = preparar();
    fireEvent.keyDown(document.body, { key: 'x' });
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(acciones.girar).not.toHaveBeenCalled();
    expect(acciones.voltear).not.toHaveBeenCalled();
    expect(acciones.marcar).not.toHaveBeenCalled();
  });

  it('usa las ultimas acciones sin reenganchar el listener', () => {
    const objetivo = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const a1 = { girar: vi.fn(), voltear: vi.fn(), marcar: vi.fn() };
    const a2 = { girar: vi.fn(), voltear: vi.fn(), marcar: vi.fn() };
    function ArnesObjetivo({ acciones }: { acciones: AccionesAtajos }) {
      useAtajosTeclado(acciones, objetivo);
      return null;
    }
    const { rerender, unmount } = render(<ArnesObjetivo acciones={a1} />);
    rerender(<ArnesObjetivo acciones={a2} />);
    expect(objetivo.addEventListener).toHaveBeenCalledTimes(1);
    const listener = objetivo.addEventListener.mock.calls[0]![1] as (e: KeyboardEvent) => void;
    listener(new KeyboardEvent('keydown', { key: 'v' }));
    expect(a1.voltear).not.toHaveBeenCalled();
    expect(a2.voltear).toHaveBeenCalledTimes(1);
    unmount();
    expect(objetivo.removeEventListener).toHaveBeenCalledWith('keydown', listener);
  });

  it('al desmontar deja de escuchar', () => {
    const { acciones, unmount } = preparar();
    unmount();
    fireEvent.keyDown(document.body, { key: 'v' });
    expect(acciones.voltear).not.toHaveBeenCalled();
  });
});
