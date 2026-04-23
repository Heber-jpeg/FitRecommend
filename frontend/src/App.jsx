import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./componentes/Layout";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";
import Rutinas from "./paginas/Rutinas";
import Calendario from "./paginas/Calendario";
import MisRutinas from "./paginas/MisRutinas";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="rutinas" element={<Rutinas />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="mis-rutinas" element={<MisRutinas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;