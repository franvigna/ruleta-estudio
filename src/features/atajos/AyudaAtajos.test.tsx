import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AyudaAtajos } from './AyudaAtajos';

describe('AyudaAtajos', () => {
  it('lista las teclas y esta oculta para lectores de pantalla', () => {
    const { container } = render(<AyudaAtajos />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    const teclas = [...container.querySelectorAll('kbd')].map((k) => k.textContent);
    expect(teclas).toEqual(['Espacio', 'Enter', 'V', 'S', 'N']);
  });
});
