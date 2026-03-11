import { useState } from "react";
import "./css/Rutinas.css";

function Rutinas() {

  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(false);

  const generarRutina = async () => {

    const perfil = localStorage.getItem("perfil");

    if (!perfil) {
      alert("Primero debes completar tu perfil");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: perfil
      });

      const data = await res.json();

      // extraer el JSON del texto
      const texto = data.response;

      const inicio = texto.indexOf("{");
      const fin = texto.lastIndexOf("}") + 1;

      const jsonRutina = JSON.parse(texto.slice(inicio, fin));

      setRutina(jsonRutina.rutina);

      localStorage.setItem(
        "rutinaGenerada",
        JSON.stringify(jsonRutina)
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const verRutinaGuardada = () => {

    const guardada = localStorage.getItem("rutinaGenerada");

    if (!guardada) {
      alert("No hay rutina guardada");
      return;
    }

    const data = JSON.parse(guardada);

    setRutina(data.rutina);

  };

  return (
    <div className="rutina-container">

      <h2>Rutina semanal</h2>

      <div className="botones-rutina">

        <button onClick={generarRutina}>
          Generar rutina
        </button>

        <button onClick={verRutinaGuardada}>
          Ver rutina guardada
        </button>

      </div>

      {loading && <p className="generando">Generando rutina...</p>}

      {rutina && !loading && (

        <div className="calendar-grid">

          {rutina.map((dia, index) => (

            <div className="day-card" key={index}>

              <h3>{dia.dia}</h3>

              <h4>{dia.titulo}</h4>

              {dia.ejercicios ? (

                <ul>

                  {dia.ejercicios.map((ej, i) => (
                    <li key={i}>{ej}</li>
                  ))}

                </ul>

              ) : (

                <p className="descanso">
                  Día de descanso
                </p>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Rutinas;