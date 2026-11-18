import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BotonReiniciar } from './BotonReiniciar';

const TEXTO = 'Reiniciar progreso';
const ARMADO = '¿Seguro? Tocá de nuevo para borrar todo';

describe('BotonReiniciar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('el primer clic arma sin confirmar y el segundo confirma', () => {
    const alConfirmar = vi.fn();
    render(<BotonReiniciar alConfirmar={alConfirmar} />);
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    expect(alConfirmar).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: ARMADO })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: ARMADO }));
    expect(alConfirmar).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: TEXTO })).toBeInTheDocument();
  });

  it('vence a los 4 s y vuelve al texto original', () => {
    render(<BotonReiniciar alConfirmar={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(screen.getByRole('button', { name: ARMADO })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('button', { name: TEXTO })).toBeInTheDocument();
  });

  it('no confirma tras vencer: hace falta armar de nuevo', () => {
    const alConfirmar = vi.fn();
    render(<BotonReiniciar alConfirmar={alConfirmar} />);
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    expect(alConfirmar).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: ARMADO })).toBeInTheDocument();
  });

  it('respeta msArmado', () => {
    render(<BotonReiniciar alConfirmar={vi.fn()} msArmado={1000} />);
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('button', { name: TEXTO })).toBeInTheDocument();
  });

  it('confirmar limpia el temporizador y desmontar no deja timers', () => {
    const { unmount } = render(<BotonReiniciar alConfirmar={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    expect(vi.getTimerCount()).toBe(1);
    fireEvent.click(screen.getByRole('button', { name: ARMADO }));
    expect(vi.getTimerCount()).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: TEXTO }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
