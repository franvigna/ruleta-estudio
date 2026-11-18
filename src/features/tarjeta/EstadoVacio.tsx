import estilos from './EstadoVacio.module.css';

export function EstadoVacio({ todoSabido }: { todoSabido: boolean }) {
  return (
    <div className={estilos.vacio}>
      {todoSabido ? (
        <>
          <strong>Te sabés todas las preguntas.</strong>
          <br />
          Reiniciá el progreso para empezar de nuevo.
        </>
      ) : (
        <>
          <strong>Todavía no giraste.</strong>
          <br />
          Tocá el centro de la ruleta o apretá Espacio, y la ruleta elige el tema.
        </>
      )}
    </div>
  );
}
