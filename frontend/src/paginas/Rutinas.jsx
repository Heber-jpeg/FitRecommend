import { useState } from "react";
import "./css/Rutinas.css";

function Rutinas() {

  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(false);

  /* GENERAR NUEVA RUTINA */
  const generarRutina = async () => {

    const perfilGuardado = localStorage.getItem("perfil");

    if (!perfilGuardado) {
      alert("Primero debes completar tu perfil.");
      return;
    }

    const perfil = JSON.parse(perfilGuardado);

    try {

      setLoading(true);   // empieza carga

      const respuesta = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(perfil)
      });

      const data = await respuesta.json();

      setRutina(data);

      localStorage.setItem("rutinaGenerada", JSON.stringify(data));

    } catch (error) {

      console.error("Error:", error);
      alert("Error al generar la rutina");

    } finally {

      setLoading(false);  // termina carga

    }

  };

  /* VER RUTINA GUARDADA */
  const verRutinaGuardada = () => {

    const rutinaGuardada = localStorage.getItem("rutinaGenerada");

    if (!rutinaGuardada) {
      alert("No tienes una rutina generada todavía.");
      return;
    }

    setRutina(JSON.parse(rutinaGuardada));
  };

  return (
    <div className="rutina-container">

      <h2>Rutinas recomendadas</h2>

      <div className="botones-rutina">

        <button onClick={generarRutina} className="btn-generar">
          Generar nueva rutina
        </button>

        <button onClick={verRutinaGuardada} className="btn-ver">
          Ver rutina guardada
        </button>

      </div>

      {loading && (
        <p className="generando">
          Generando rutina...
        </p>
      )}

      {rutina && !loading && (
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