import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./componentes/Layout";
import Inicio from "./paginas/Inicio";
import Perfil from "./paginas/Perfil";
import Rutinas from "./paginas/Rutinas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="rutinas" element={<Rutinas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;