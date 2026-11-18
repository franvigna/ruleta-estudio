import { Link } from 'react-router-dom';
import { HREF_CATALOGO } from '../router';
import estilos from './LayoutMateria.module.css';

export function NoEncontrado() {
  return (
    <main className={estilos.mensaje}>
      <h1>Página no encontrada</h1>
      <p>La dirección que abriste no existe.</p>
      <Link className={estilos.enlace} to={HREF_CATALOGO}>
        Volver a las materias
      </Link>
    </main>
  );
}
