import { useState } from 'react';
import './App.css'
import Navbar from './componentes/Navbar.jsx'
import PerfilForm from './componentes/PerfilForm.jsx';

function App() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  return (
    <>
      <Navbar abrirPerfil={() => setMostrarPerfil(true)} />
        {mostrarPerfil && (
        <PerfilForm cerrarPerfil={() => setMostrarPerfil(false)} />
      )}

      <p>Sistema de recomendaciones de ejercicios personalizados para principiantes o personas con experiencia</p>
    </>
  );
}

export default App;