import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Resumen } from './Resumen';

describe('Resumen', () => {
  it('muestra los 4 datos', () => {
    render(<Resumen resumen={{ total: 20, si: 5, no: 3, sin: 12, pct: 25 }} />);
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('de la materia sabida')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('sabidas de 20')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('para repasar')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('sin responder')).toBeInTheDocument();
  });
});
