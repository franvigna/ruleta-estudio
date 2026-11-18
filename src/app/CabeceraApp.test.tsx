import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CabeceraApp } from './CabeceraApp';

describe('CabeceraApp', () => {
  it('muestra volver, progreso y tema en una materia', () => {
    render(
      <MemoryRouter initialEntries={['/materia/demo']}>
        <CabeceraApp />
      </MemoryRouter>,
    );

    const volver = screen.getByRole('link', { name: 'Volver a las materias' });
    expect(volver).toHaveTextContent('');
    expect(volver).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Progreso' })).toHaveAttribute(
      'href',
      '/materia/demo/progreso',
    );
    expect(screen.getByRole('button', { name: 'Activar tema oscuro' })).toBeInTheDocument();
  });

  it('en el catalogo conserva solamente el selector de tema', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CabeceraApp />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('link', { name: 'Volver a las materias' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Progreso' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Activar tema oscuro' })).toBeInTheDocument();
  });

  it('en progreso muestra el acceso a la ruleta en lugar de progreso', () => {
    render(
      <MemoryRouter initialEntries={['/materia/demo/progreso']}>
        <CabeceraApp />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Ruleta' })).toHaveAttribute('href', '/materia/demo');
    expect(screen.queryByRole('link', { name: 'Progreso' })).not.toBeInTheDocument();
  });
});
