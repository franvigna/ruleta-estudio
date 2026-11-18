import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import { App } from './app/App';
import { crearDependencias } from './app/composition';

const raiz = document.getElementById('root');
if (!raiz) throw new Error('Falta #root');

createRoot(raiz).render(
  <StrictMode>
    <App deps={crearDependencias()} />
  </StrictMode>,
);
