import type { Dependencias } from './providers/DependenciasProvider';
import { DependenciasProvider } from './providers/DependenciasProvider';
import { ProgresoProvider } from './providers/ProgresoProvider';
import { Router } from './router';
import { RutasApp } from './routes';

export function App({ deps }: { deps: Dependencias }) {
  return (
    <DependenciasProvider deps={deps}>
      <ProgresoProvider repositorio={deps.progresoRepo} persistente={deps.persistente}>
        <Router>
          <RutasApp />
        </Router>
      </ProgresoProvider>
    </DependenciasProvider>
  );
}
