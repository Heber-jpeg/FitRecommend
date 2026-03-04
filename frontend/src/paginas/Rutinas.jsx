import { useState } from "react";

function Rutinas() {
  const [rutina, setRutina] = useState(null);

  const generarRutina = () => {
    const rutinaGuardada = localStorage.getItem("rutinaGenerada");

    if (!rutinaGuardada) {
      alert("Primero debes guardar tu perfil.");
      return;
    }

    setRutina(JSON.parse(rutinaGuardada));
  };

  return (
    <div className="rutina-container">
      <h2>Rutinas recomendadas</h2>

      <button onClick={generarRutina} className="btn-generar">
        Generar Rutina
      </button>

      {rutina && (
        <div className="rutina-box">
          <h3>Tu rutina personalizada</h3>

          <div className="rutina-texto">
            {rutina.response}
          </div>
        </div>
      )}
    </div>
  );
}

export default Rutinas;