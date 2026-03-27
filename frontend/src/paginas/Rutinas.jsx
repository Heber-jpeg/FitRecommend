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

      if (!res.ok) {
        throw new Error("Error en el servidor");
      }

      const data = await res.json();

      setRutina(data.rutina);

      localStorage.setItem(
        "rutinaGenerada",
        JSON.stringify(data)
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

      <h2>Rutina mensual</h2>

      <div className="botones-rutina">
        <button onClick={generarRutina}>Generar rutina</button>
        <button onClick={verRutinaGuardada}>Ver rutina guardada</button>
      </div>

      {loading && <p className="generando">Generando rutina...</p>}

      {/* 🔥 ENCABEZADO CALENDARIO */}
      {rutina && !loading && (
        <>
          <div className="calendar-header">
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d, i) => (
              <div key={i} className="day-header">{d}</div>
            ))}
          </div>

          <div className="calendar-grid">

            {rutina.map((dia, index) => (

              <div
                className={`day-card ${!dia.ejercicios ? "rest-day" : ""}`}
                key={index}
              >

                <h3>Día {index + 1}</h3>
                <h4>{dia.titulo}</h4>

                {dia.ejercicios ? (

                  <ul>
                    {dia.ejercicios.map((ej, i) => (
                      <li key={i}>{ej}</li>
                    ))}
                  </ul>

                ) : (

                  <p className="descanso">Descanso</p>

                )}

              </div>

            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default Rutinas;