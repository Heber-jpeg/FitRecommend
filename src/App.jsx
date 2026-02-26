import { useState } from 'react';
import './App.css'
import Navbar from './componentes/Navbar.jsx'
import PerfilForm from './componentes/PerfilForm.jsx';
import Recomendaciones from './componentes/Recomendaciones.jsx';

function App() {
  const [perfil, setPerfil] = useState(null);
  return (
    <>
      <Navbar />
      <PerfilForm setPerfil={setPerfil}/>
      <Recomendaciones perfil={perfil} />
      <p>Sistema de recomendaciones de ejercicios personalizados para principiantes o personas con experiencia</p>
    </>
  );
}

export default App;