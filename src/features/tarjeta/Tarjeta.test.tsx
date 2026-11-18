import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Pregunta } from '../../domain/types';
import { Tarjeta } from './Tarjeta';

const pregunta: Pregunta = {
  id: 'p1',
  tipo: 'teorica',
  enunciado:
    '<p>Que es <em>NP</em>?</p><div class="tbl"><table><tr><td>celda</td></tr></table></div>',
  respuesta: '<p>Una clase de complejidad.</p>',
  etiqueta: 'Tomada en parciales',
  nota: 'Ojo con esto',
};
const tema = { nombre: 'Complejidad', area: 'CC' };

function montar(parcial: Partial<Parameters<typeof Tarjeta>[0]> = {}) {
  const alVoltear = vi.fn();
  render(
    <Tarjeta
      tema={tema}
      pregunta={pregunta}
      dada={false}
      repaso={false}
      alVoltear={alVoltear}
      {...parcial}
    />,
  );
  return { alVoltear };
}

describe('Tarjeta', () => {
  it('muestra el frente: pregunta, etiqueta, chip y pie', () => {
    montar();
    const frente = screen.getByTestId('cara-frente');
    expect(frente).toHaveAttribute('aria-hidden', 'false');
    expect(frente.querySelector('em')).toHaveTextContent('NP');
    expect(frente.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Tomada en parciales')).toBeInTheDocument();
    expect(screen.getByText('Tocá la tarjeta para ver la respuesta')).toBeInTheDocument();
    expect(screen.queryByText('Para repasar')).not.toBeInTheDocument();
  });

  it('el color del area se pasa como variable inline', () => {
    montar();
    const tarjeta = screen.getByRole('button', { name: /Tarjeta/ });
    expect(tarjeta.style.getPropertyValue('--area')).toBe('var(--area-CC)');
  });

  it.each([
    ['si', 'si'],
    ['no', 'no'],
  ] as const)('refleja la marca %s para colorear la tarjeta', (_, marca) => {
    montar({ marca });
    expect(screen.getByRole('button', { name: /Tarjeta/ })).toHaveAttribute('data-marca', marca);
  });

  it('sin etiqueta no pinta insignia y con repaso la pinta', () => {
    montar({ pregunta: { ...pregunta, etiqueta: undefined }, repaso: true });
    expect(screen.queryByText('Tomada en parciales')).not.toBeInTheDocument();
    expect(screen.getByText('Para repasar')).toBeInTheDocument();
  });

  it('dorso: respuesta, rotulo Respuesta y nota', () => {
    montar({ dada: true });
    const dorso = screen.getByTestId('cara-dorso');
    expect(dorso).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByTestId('cara-frente')).toHaveAttribute('aria-hidden', 'true');
    expect(dorso).toHaveTextContent('Una clase de complejidad.');
    expect(dorso).toHaveTextContent('Respuesta');
    expect(dorso.querySelector('p')).toHaveTextContent('Ojo con esto');
    expect(screen.getByText('Tocá la tarjeta para volver a la pregunta')).toBeInTheDocument();
  });

  it('sin nota no hay parrafo de nota', () => {
    montar({ dada: true, pregunta: { ...pregunta, nota: undefined } });
    expect(screen.queryByText('Ojo con esto')).not.toBeInTheDocument();
  });

  it('aria-pressed y aria-label reflejan dada', () => {
    montar();
    const b = screen.getByRole('button', { name: 'Tarjeta: tocá para ver la respuesta' });
    expect(b).toHaveAttribute('aria-pressed', 'false');
  });

  it('con dada el nombre cambia y aria-pressed es true', () => {
    montar({ dada: true });
    const b = screen.getByRole('button', {
      name: 'Tarjeta: mostrando la respuesta, tocá para volver',
    });
    expect(b).toHaveAttribute('aria-pressed', 'true');
  });

  it('el clic voltea', async () => {
    const { alVoltear } = montar();
    await userEvent.click(screen.getByRole('button', { name: /Tarjeta/ }));
    expect(alVoltear).toHaveBeenCalledTimes(1);
  });

  it.each(['{Enter}', ' '])('la tecla %j voltea y no se propaga', async (tecla) => {
    const alVoltear = vi.fn();
    const alTeclaPadre = vi.fn();
    document.body.addEventListener('keydown', alTeclaPadre);
    try {
      render(
        <Tarjeta
          tema={tema}
          pregunta={pregunta}
          dada={false}
          repaso={false}
          alVoltear={alVoltear}
        />,
      );
      screen.getByRole('button', { name: /Tarjeta/ }).focus();
      await userEvent.keyboard(tecla);
      expect(alVoltear).toHaveBeenCalledTimes(1);
      expect(alTeclaPadre).not.toHaveBeenCalled();
    } finally {
      document.body.removeEventListener('keydown', alTeclaPadre);
    }
  });

  it('otras teclas no voltean', () => {
    const { alVoltear } = montar();
    fireEvent.keyDown(screen.getByRole('button', { name: /Tarjeta/ }), { key: 'a' });
    expect(alVoltear).not.toHaveBeenCalled();
  });
});
