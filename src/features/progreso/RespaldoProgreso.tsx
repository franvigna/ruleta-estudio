import { useId, useState } from 'react';
import { Boton } from '../../shared/ui';
import estilos from './RespaldoProgreso.module.css';

export interface ResultadoImportacion {
  ok: boolean;
  mensaje: string;
}

export interface RespaldoProgresoProps {
  /** Texto del respaldo del progreso actual. */
  generarCodigo(): string;
  /** Une el codigo pegado con el progreso actual. */
  alImportar(codigo: string): ResultadoImportacion;
}

interface Aviso {
  ok: boolean;
  texto: string;
}

export function RespaldoProgreso({ generarCodigo, alImportar }: RespaldoProgresoProps) {
  const idPegar = useId();
  const idCodigo = useId();
  const [pegado, setPegado] = useState('');
  const [aviso, setAviso] = useState<Aviso | null>(null);
  // Si el navegador no deja copiar solo, se muestra el codigo para copiarlo a mano.
  const [codigoManual, setCodigoManual] = useState<string | null>(null);

  const copiar = async () => {
    const codigo = generarCodigo();
    try {
      await navigator.clipboard.writeText(codigo);
      setCodigoManual(null);
      setAviso({ ok: true, texto: 'Código copiado. Pegalo en el otro dispositivo.' });
    } catch {
      setCodigoManual(codigo);
      setAviso({ ok: false, texto: 'No se pudo copiar solo. Copiá el código de abajo.' });
    }
  };

  const importar = () => {
    const r = alImportar(pegado);
    setAviso({ ok: r.ok, texto: r.mensaje });
    if (r.ok) setPegado('');
  };

  return (
    <section className={estilos.respaldo} aria-labelledby="titulo-respaldo">
      <h2 id="titulo-respaldo">Pasar el progreso a otro dispositivo</h2>
      <p className={estilos.ayuda}>
        Copiá el código y mandátelo por un chat. En el otro dispositivo pegalo acá y tocá Importar:
        se suma a lo que ya tengas.
      </p>

      <Boton onClick={() => void copiar()}>Copiar progreso</Boton>
      {codigoManual !== null ? (
        <textarea
          className={estilos.codigo}
          aria-label="Código para copiar"
          readOnly
          rows={4}
          value={codigoManual}
          onFocus={(e) => e.currentTarget.select()}
          id={idCodigo}
        />
      ) : null}

      <label className={estilos.etiqueta} htmlFor={idPegar}>
        Pegá acá el código del otro dispositivo
      </label>
      <textarea
        id={idPegar}
        className={estilos.codigo}
        rows={4}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        value={pegado}
        onChange={(e) => setPegado(e.target.value)}
      />
      <Boton disabled={pegado.trim() === ''} onClick={importar}>
        Importar progreso
      </Boton>

      {aviso ? (
        <p role="status" className={aviso.ok ? estilos.ok : estilos.error}>
          {aviso.texto}
        </p>
      ) : null}
    </section>
  );
}
