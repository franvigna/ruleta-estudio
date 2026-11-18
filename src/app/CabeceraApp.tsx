import { Link, matchPath, useLocation } from 'react-router-dom';
import { hrefMateria, hrefProgreso, HREF_CATALOGO } from './router';
import { BotonTema } from './BotonTema';
import estilos from './CabeceraApp.module.css';

function IconoVolver() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M10 7l-5 5 5 5" />
    </svg>
  );
}

export function CabeceraApp() {
  const { pathname } = useLocation();
  const coincidencia = matchPath('/materia/:id/*', pathname);
  const materiaId = coincidencia?.params.id;
  const enProgreso = materiaId !== undefined && pathname.endsWith('/progreso');

  return (
    <header className={estilos.cabecera} aria-label="Navegación principal">
      {materiaId ? (
        <Link
          className={`${estilos.control} ${estilos.volver}`}
          to={HREF_CATALOGO}
          aria-label="Volver a las materias"
          title="Volver a las materias"
        >
          <IconoVolver />
        </Link>
      ) : null}
      {materiaId ? (
        <Link
          className={`${estilos.control} ${estilos.progreso}`}
          to={enProgreso ? hrefMateria(materiaId) : hrefProgreso(materiaId)}
        >
          {enProgreso ? 'Ruleta' : 'Progreso'}
        </Link>
      ) : null}
      <BotonTema className={estilos.tema} />
    </header>
  );
}
