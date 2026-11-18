import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Acciones, type AccionesProps } from './Acciones';

function montar(parcial: Partial<AccionesProps> = {}) {
  const props: AccionesProps = {
    marcarVisible: true,
    marca: undefined,
    alMarcar: vi.fn(),
    alOtra: vi.fn(),
    alGirarDeNuevo: vi.fn(),
    ...parcial,
  };
  render(<Acciones {...props} />);
  return props;
}

describe('Acciones', () => {
  it('sin marcarVisible solo hay Otra y Girar de nuevo', () => {
    montar({ marcarVisible: false });
    expect(screen.queryByText('¿Te la sabías?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Me la sabía' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Otra de este tema' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Girar de nuevo' })).toBeInTheDocument();
  });

  it('con marcarVisible muestra los botones de marca sin presionar', () => {
    montar();
    expect(screen.getByText('¿Te la sabías?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Me la sabía' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'No me la sabía' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.queryByText('Sale de la ruleta.')).not.toBeInTheDocument();
    expect(screen.queryByText('Queda para repasar.')).not.toBeInTheDocument();
  });

  it('marca si: aria-pressed y texto de estado', () => {
    montar({ marca: 'si' });
    expect(screen.getByRole('button', { name: 'Me la sabía' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'No me la sabía' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByText('Sale de la ruleta.')).toBeInTheDocument();
  });

  it('marca no: aria-pressed y texto de estado', () => {
    montar({ marca: 'no' });
    expect(screen.getByRole('button', { name: 'No me la sabía' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Queda para repasar.')).toBeInTheDocument();
  });

  it('dispara los callbacks', async () => {
    const props = montar();
    await userEvent.click(screen.getByRole('button', { name: 'Me la sabía' }));
    await userEvent.click(screen.getByRole('button', { name: 'No me la sabía' }));
    await userEvent.click(screen.getByRole('button', { name: 'Otra de este tema' }));
    await userEvent.click(screen.getByRole('button', { name: 'Girar de nuevo' }));
    expect(props.alMarcar).toHaveBeenNthCalledWith(1, 'si');
    expect(props.alMarcar).toHaveBeenNthCalledWith(2, 'no');
    expect(props.alOtra).toHaveBeenCalledTimes(1);
    expect(props.alGirarDeNuevo).toHaveBeenCalledTimes(1);
  });
});
