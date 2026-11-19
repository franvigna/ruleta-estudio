import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RespaldoProgreso } from './RespaldoProgreso';

function montar(alImportar = vi.fn(() => ({ ok: true, mensaje: 'Progreso importado.' }))) {
  const usuario = userEvent.setup();
  render(<RespaldoProgreso generarCodigo={() => 'CODIGO-123'} alImportar={alImportar} />);
  return { usuario, alImportar };
}

afterEach(() => vi.restoreAllMocks());

describe('RespaldoProgreso', () => {
  it('copia el codigo al portapapeles y avisa', async () => {
    const { usuario } = montar();
    const escribir = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    await usuario.click(screen.getByRole('button', { name: 'Copiar progreso' }));
    expect(escribir).toHaveBeenCalledWith('CODIGO-123');
    expect(screen.getByRole('status')).toHaveTextContent('Código copiado');
    expect(screen.queryByLabelText('Código para copiar')).not.toBeInTheDocument();
  });

  it('si no puede copiar muestra el codigo para copiarlo a mano', async () => {
    const { usuario } = montar();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('bloqueado'));
    await usuario.click(screen.getByRole('button', { name: 'Copiar progreso' }));
    expect(screen.getByLabelText('Código para copiar')).toHaveValue('CODIGO-123');
    expect(screen.getByRole('status')).toHaveTextContent('No se pudo copiar');
  });

  it('importar esta deshabilitado sin texto, importa lo pegado y limpia el campo', async () => {
    const { usuario, alImportar } = montar();
    const boton = screen.getByRole('button', { name: 'Importar progreso' });
    expect(boton).toBeDisabled();
    const campo = screen.getByLabelText('Pegá acá el código del otro dispositivo');
    await usuario.click(campo);
    await usuario.paste('{"x":1}');
    expect(boton).toBeEnabled();
    await usuario.click(boton);
    expect(alImportar).toHaveBeenCalledWith('{"x":1}');
    expect(screen.getByRole('status')).toHaveTextContent('Progreso importado.');
    expect(campo).toHaveValue('');
  });

  it('con error muestra el mensaje y conserva lo pegado', async () => {
    const { usuario } = montar(vi.fn(() => ({ ok: false, mensaje: 'Código inválido.' })));
    const campo = screen.getByLabelText('Pegá acá el código del otro dispositivo');
    await usuario.click(campo);
    await usuario.paste('basura');
    await usuario.click(screen.getByRole('button', { name: 'Importar progreso' }));
    expect(screen.getByRole('status')).toHaveTextContent('Código inválido.');
    expect(campo).toHaveValue('basura');
  });
});
