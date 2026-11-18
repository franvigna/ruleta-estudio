import { Route, Routes } from 'react-router-dom';
import { LayoutMateria } from './pantallas/LayoutMateria';
import { NoEncontrado } from './pantallas/NoEncontrado';
import { PantallaCatalogo } from './pantallas/PantallaCatalogo';
import { PantallaProgreso } from './pantallas/PantallaProgreso';
import { PantallaRuleta } from './pantallas/PantallaRuleta';

export function RutasApp() {
  return (
    <Routes>
      <Route path="/" element={<PantallaCatalogo />} />
      <Route path="/materia/:id" element={<LayoutMateria />}>
        <Route index element={<PantallaRuleta />} />
        <Route path="progreso" element={<PantallaProgreso />} />
      </Route>
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}
