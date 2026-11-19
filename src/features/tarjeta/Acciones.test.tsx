import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Acciones, type AccionesProps } from './Acciones';

function montar(parcial: Partial<AccionesProps> = {}) {
  const props: AccionesProps = {
    marcarVisible: true,
    marca: undefined,
    posicion: { actual: 1, total: 1 },
    alMarcar: vi.fn(),
    alAnterior: vi.fn(),
    alOtra: vi.fn(),
    alGirarDeNuevo: vi.fn(),
    ...parcial,
  };
  render(<Acciones {...props} />);
  return props;
}

describe('Acciones', () => {
  it('sin marcarVisible solo hay acciones de siguiente pregunta y volver a girar', () => {
    montar({ marcarVisible: false });
    expect(screen.queryByText('¿Te la sabías?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Me la sabía' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Siguiente pregunta del mismo tema' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a girar la ruleta' })).toBeInTheDocument();
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

  it('con una sola pregunta no hay anterior ni contador', () => {
    montar({ posicion: { actual: 1, total: 1 } });
    expect(screen.queryByRole('button', { name: 'Pregunta anterior' })).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
  });

  it('en la primera de varias muestra la posicion pero no el anterior', () => {
    montar({ posicion: { actual: 1, total: 3 } });
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pregunta anterior' })).not.toBeInTheDocument();
  });

  it('anterior se habilita desde la segunda pregunta', async () => {
    const props = montar({ posicion: { actual: 2, total: 3 } });
    await userEvent.click(screen.getByRole('button', { name: 'Pregunta anterior' }));
    expect(props.alAnterior).toHaveBeenCalledTimes(1);
  });

  it('dispara los callbacks', async () => {
    const props = montar();
    await userEvent.click(screen.getByRole('button', { name: 'Me la sabía' }));
    await userEvent.click(screen.getByRole('button', { name: 'No me la sabía' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Siguiente pregunta del mismo tema' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Volver a girar la ruleta' }));
    expect(props.alMarcar).toHaveBeenNthCalledWith(1, 'si');
    expect(props.alMarcar).toHaveBeenNthCalledWith(2, 'no');
    expect(props.alOtra).toHaveBeenCalledTimes(1);
    expect(props.alGirarDeNuevo).toHaveBeenCalledTimes(1);
  });
});
