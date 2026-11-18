import type { ReactNode } from 'react';
import estilos from './Kbd.module.css';

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className={estilos.kbd}>{children}</kbd>;
}
