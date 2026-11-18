/**
 * Efectos sintetizados con Web Audio. No descargan archivos y fallan en silencio
 * cuando el navegador no ofrece audio (tests, permisos o dispositivos sin salida).
 */
let contexto: AudioContext | null = null;

type VentanaConWebkit = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function obtenerContexto(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Constructor = window.AudioContext ?? (window as VentanaConWebkit).webkitAudioContext;
  if (!Constructor) return null;
  try {
    contexto ??= new Constructor();
    return contexto;
  } catch {
    return null;
  }
}

function ejecutar(programar: (ctx: AudioContext) => void): void {
  const ctx = obtenerContexto();
  if (!ctx) return;
  if (ctx.state === 'running') {
    programar(ctx);
    return;
  }
  void ctx.resume().then(
    () => programar(ctx),
    () => undefined,
  );
}

function nota(
  ctx: AudioContext,
  frecuencia: number,
  inicio: number,
  duracion: number,
  volumen: number,
  tipo: OscillatorType = 'sine',
  frecuenciaFinal = frecuencia,
): void {
  const oscilador = ctx.createOscillator();
  const ganancia = ctx.createGain();
  const fin = inicio + duracion;

  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(frecuencia, inicio);
  oscilador.frequency.exponentialRampToValueAtTime(Math.max(40, frecuenciaFinal), fin);
  ganancia.gain.setValueAtTime(0.0001, inicio);
  ganancia.gain.exponentialRampToValueAtTime(volumen, inicio + Math.min(0.012, duracion / 4));
  ganancia.gain.exponentialRampToValueAtTime(0.0001, fin);

  oscilador.connect(ganancia);
  ganancia.connect(ctx.destination);
  oscilador.start(inicio);
  oscilador.stop(fin + 0.01);
}

/** Desbloquea el contexto dentro del gesto que inicia el giro. */
export function activarSonido(): void {
  ejecutar(() => undefined);
}

/** Golpe corto y seco al pasar de un segmento a otro. */
export function sonidoTac(): void {
  ejecutar((ctx) => {
    const t = ctx.currentTime;
    nota(ctx, 820, t, 0.035, 0.025, 'square', 430);
  });
}

/** Dos campanadas ascendentes al quedar seleccionado un tema. */
export function sonidoSeleccion(): void {
  ejecutar((ctx) => {
    const t = ctx.currentTime;
    nota(ctx, 659.25, t, 0.12, 0.085, 'sine');
    nota(ctx, 987.77, t + 0.105, 0.24, 0.1, 'sine');
  });
}

/** Acorde ascendente de victoria. */
export function sonidoVictoria(): void {
  ejecutar((ctx) => {
    const t = ctx.currentTime;
    nota(ctx, 523.25, t, 0.16, 0.075, 'triangle');
    nota(ctx, 659.25, t + 0.09, 0.18, 0.075, 'triangle');
    nota(ctx, 783.99, t + 0.18, 0.2, 0.085, 'triangle');
    nota(ctx, 1046.5, t + 0.3, 0.42, 0.1, 'triangle');
  });
}

/** Cuatro notas descendentes tipo trompeta triste. */
export function sonidoTrompetaTriste(): void {
  ejecutar((ctx) => {
    const t = ctx.currentTime;
    [392, 369.99, 349.23, 293.66].forEach((frecuencia, i) => {
      const inicio = t + i * 0.22;
      nota(ctx, frecuencia, inicio, 0.3, 0.055, 'sawtooth', frecuencia * 0.83);
    });
  });
}
