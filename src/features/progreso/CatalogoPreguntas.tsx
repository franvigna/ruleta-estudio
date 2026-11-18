import { useState, type CSSProperties } from 'react';
import type { EstadisticaTema } from '../../domain/estadisticas';
import { fallosDe, marcaDe } from '../../domain/progreso';
import type { Marca, Pregunta, Progreso } from '../../domain/types';
import { Boton, varArea } from '../../shared/ui';
import estilos from './CatalogoPreguntas.module.css';

type Filtro = 'todas' | 'reforzar';

interface PreguntaCatalogo {
  readonly pregunta: Pregunta;
  readonly marca: Marca | undefined;
  readonly fallos: number;
}

function textoMarca(marca: Marca | undefined): string {
  if (marca === 'si') return 'Sabida';
  if (marca === 'no') return 'No sabida';
  return 'Sin responder';
}

function PreguntaDesplegable({ item }: { item: PreguntaCatalogo }) {
  return (
    <li>
      <details className={estilos.pregunta} data-marca={item.marca ?? 'sin'}>
        <summary>
          <span className={estilos.estado}>{textoMarca(item.marca)}</span>
          <div
            className={estilos.enunciado}
            dangerouslySetInnerHTML={{ __html: item.pregunta.enunciado }}
          />
          {item.fallos > 0 ? (
            <strong className={estilos.fallos}>
              {item.fallos} {item.fallos === 1 ? 'fallo' : 'fallos'}
            </strong>
          ) : null}
        </summary>
        <div className={estilos.respuesta}>
          <h4>Respuesta</h4>
          <div dangerouslySetInnerHTML={{ __html: item.pregunta.respuesta }} />
          {item.pregunta.nota ? <p className={estilos.nota}>{item.pregunta.nota}</p> : null}
        </div>
      </details>
    </li>
  );
}

export function CatalogoPreguntas({
  porTema,
  progreso,
}: {
  porTema: readonly EstadisticaTema[];
  progreso: Progreso;
}) {
  const [filtro, setFiltro] = useState<Filtro>('todas');

  const temas = porTema
    .map((estadistica) => {
      const preguntas = estadistica.tema.preguntas
        .map((pregunta) => ({
          pregunta,
          marca: marcaDe(progreso, pregunta.id),
          fallos: fallosDe(progreso, pregunta.id),
        }))
        .filter((item) => filtro === 'todas' || item.fallos > 0 || item.marca === 'no')
        .sort((a, b) => (filtro === 'reforzar' ? b.fallos - a.fallos : 0));
      return { estadistica, preguntas };
    })
    .filter((item) => filtro === 'todas' || item.preguntas.length > 0);

  return (
    <section aria-labelledby="titulo-catalogo-preguntas">
      <header className={estilos.cabecera}>
        <div>
          <h2 id="titulo-catalogo-preguntas">Por tema</h2>
          <p>Abrí una unidad y después una pregunta para consultar su respuesta.</p>
        </div>
        <div className={estilos.filtros} role="group" aria-label="Filtrar preguntas">
          <Boton
            tono={filtro === 'todas' ? 'si' : 'neutro'}
            aria-pressed={filtro === 'todas'}
            onClick={() => setFiltro('todas')}
          >
            Todas
          </Boton>
          <Boton
            tono={filtro === 'reforzar' ? 'no' : 'neutro'}
            aria-pressed={filtro === 'reforzar'}
            onClick={() => setFiltro('reforzar')}
          >
            Temas para reforzar
          </Boton>
        </div>
      </header>

      <div className={estilos.leyenda}>
        <span>
          <i className={estilos.leySi} /> Sabidas
        </span>
        <span>
          <i className={estilos.leyNo} /> No sabidas
        </span>
        <span>
          <i className={estilos.leySin} /> Sin responder
        </span>
      </div>

      {temas.length === 0 ? (
        <p className={estilos.vacio} role="status">
          Todavía no hay preguntas para reforzar. Aparecerán cuando marques alguna como no sabida.
        </p>
      ) : (
        <div className={estilos.temas}>
          {temas.map(({ estadistica, preguntas }) => {
            const { tema, si, no, sin, total, pct } = estadistica;
            const ancho = (cantidad: number) =>
              total === 0 ? 0 : Math.round((10000 * cantidad) / total) / 100;
            return (
              <details
                className={estilos.tema}
                key={`${filtro}-${tema.id}`}
                open={filtro === 'reforzar' || undefined}
                style={{ '--c': varArea(tema.area) } as CSSProperties}
              >
                <summary>
                  <span className={estilos.nombreTema}>{tema.nombre}</span>
                  <span className={estilos.barra} aria-hidden="true">
                    <i className={estilos.si} style={{ width: `${ancho(si)}%` }} />
                    <i className={estilos.no} style={{ width: `${ancho(no)}%` }} />
                  </span>
                  <span className={estilos.conteo}>
                    <b>{pct}%</b> · {si} de {total}
                  </span>
                  <span className="sr">
                    {si} sabidas, {no} no sabidas, {sin} sin responder
                  </span>
                </summary>
                <ol className={estilos.listaPreguntas}>
                  {preguntas.map((item) => (
                    <PreguntaDesplegable key={item.pregunta.id} item={item} />
                  ))}
                </ol>
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}
