import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarraTema } from './BarraTema';
import { estadistica, temaDe } from './fixtures';

describe('BarraTema', () => {
  it('muestra nombre, barra accesible, anchos y numeros', () => {
    const { container } = render(
      <BarraTema estadistica={estadistica(temaDe('t1', 'Grafos', 'GR'), 2, 1, 1)} />,
    );
    expect(screen.getByText('Grafos')).toBeInTheDocument();
    const barra = screen.getByRole('img', { name: '2 sabidas, 1 no sabidas, 1 sin responder' });
    const [si, no] = Array.from(barra.children) as HTMLElement[];
    expect(si?.style.width).toBe('50%');
    expect(no?.style.width).toBe('25%');
    expect(container).toHaveTextContent('50% 2 de 4');
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--c')).toBe(
      'var(--area-GR)',
    );
  });

  it('con total cero no divide por cero', () => {
    render(<BarraTema estadistica={estadistica(temaDe('t1', 'Vacio', 'GR'), 0, 0, 0)} />);
    const barra = screen.getByRole('img');
    const [si] = Array.from(barra.children) as HTMLElement[];
    expect(si?.style.width).toBe('0%');
  });
});
