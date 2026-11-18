/** Reloj y cuadros de animacion inyectables (los tests usan uno falso). */
export interface Animador {
  ahora(): number;
  pedirCuadro(cb: (t: number) => void): number;
  cancelarCuadro(id: number): void;
}
