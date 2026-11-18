import { screen } from '@testing-library/react';
import { renderizarApp } from './testing/renderizar-app';

describe('App', () => {
  it('muestra el catalogo en la ruta inicial', async () => {
    renderizarApp({ ruta: '/' });
    expect(screen.getByRole('heading', { name: 'Ruleta de Estudio' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Demo/ })).toBeInTheDocument();
    expect(screen.queryByText('Otra materia')).not.toBeInTheDocument();
  });
});
