import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Pregunta } from '../../domain/types';
import { ColumnaTarjeta, type ColumnaTarjetaProps } from './ColumnaTarjeta';

const pregunta: Pregunta = {
  id: 'p1',
  tipo: 'teorica',
  enunciado: '<p>Enunciado</p>',
  respuesta: '<p>Respuesta HTML</p>',
};

function montar(parcial: Partial<ColumnaTarjetaProps> = {}) {
  const props: ColumnaTarjetaProps = {
    contenido: { tipo: 'vacio' },
    ocupado: false,
    alCerrar: vi.fn(),
    alVoltear: vi.fn(),
    alMarcar: vi.fn(),
    alOtra: vi.fn(),
    alGirarDeNuevo: vi.fn(),
    ...parcial,
  };
  const ref = createRef<HTMLElement>();
  render(<ColumnaTarjeta ref={ref} {...props} />);
  return { props, ref };
}

describe('ColumnaTarjeta', () => {
  it('estado vacio', () => {
    const { ref } = montar();
    expect(screen.getByText('Todavía no giraste.')).toBeInTheDocument();
    expect(
      screen.getByText(/Tocá el centro de la ruleta o apretá Espacio, y la ruleta elige el tema\./),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(ref.current).toHaveAttribute('aria-live', 'polite');
    expect(ref.current).not.toHaveAttribute('aria-busy');
  });

  it('estado todo sabido', () => {
    montar({ contenido: { tipo: 'todo-sabido' } });
    expect(screen.getByText('Te sabés todas las preguntas.')).toBeInTheDocument();
    expect(screen.getByText(/Reiniciá el progreso para empezar de nuevo\./)).toBeInTheDocument();
  });

  it('ocupado pone aria-busy', () => {
    const { ref } = montar({ ocupado: true });
    expect(ref.current).toHaveAttribute('aria-busy', 'true');
  });

  it('estado tarjeta: titulo, tarjeta y acciones conectadas', async () => {
    const { props } = montar({
      contenido: {
        tipo: 'tarjeta',
        tema: { nombre: 'Grafos', area: 'GR' },
        pregunta,
        dada: true,
        marcarVisible: true,
        repaso: true,
        marca: 'no',
      },
    });
    expect(screen.getByText('Salió Grafos')).toBeInTheDocument();
    expect(screen.getByText('Para repasar')).toBeInTheDocument();
    expect(screen.getByText('Respuesta HTML')).toBeInTheDocument();
    expect(screen.getByText('Queda para repasar.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Pregunta de Grafos' })).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Cerrar tarjeta y volver a la ruleta' }),
    );
    expect(props.alCerrar).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: /Tarjeta/ }));
    expect(props.alVoltear).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Me la sabía' }));
    expect(props.alMarcar).toHaveBeenCalledWith('si');
    await userEvent.click(
      screen.getByRole('button', { name: 'Siguiente pregunta del mismo tema' }),
    );
    expect(props.alOtra).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: 'Volver a girar la ruleta' }));
    expect(props.alGirarDeNuevo).toHaveBeenCalledTimes(1);
  });
});
