import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('muestra el titulo', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Ruleta de Estudio' })).toBeInTheDocument();
  });
});
