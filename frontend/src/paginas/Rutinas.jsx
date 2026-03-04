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

      <button onClick={generarRutina}>
        Generar Rutina
      </button>

      {rutina && (
        <div className="rutina-box">
          <h3>Tu rutina personalizada</h3>

          {/* Si el backend devuelve un objeto con plan */}
          {rutina.plan ? (
            rutina.plan.map((dia, index) => (
              <div key={index} className="rutina-dia">
                <strong>{dia.dia}:</strong> {dia.ejercicio}
              </div>
            ))
          ) : (
            <pre>{JSON.stringify(rutina, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default Rutinas;