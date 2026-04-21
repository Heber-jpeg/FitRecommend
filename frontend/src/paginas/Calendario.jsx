import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Calendario.css";

function Calendario() {

  const navigate = useNavigate();

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [rutina] = useState(() => {
    const guardada = localStorage.getItem("rutinaGenerada");
    return guardada ? JSON.parse(guardada).rutina : null;
  });

  const rutinaFiltrada = rutina?.filter((dia) => {
    if (!dia.fecha) return false;
    const fecha = new Date(dia.fecha + "T00:00:00");
    return (
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha >= hoy
    );
  }) ?? [];

  const calcularOffset = () => {
    if (!rutinaFiltrada.length || !rutinaFiltrada[0]?.fecha) return 0;
    const fecha = new Date(rutinaFiltrada[0].fecha + "T00:00:00");
    const diaSemana = fecha.getDay();
    return diaSemana === 0 ? 6 : diaSemana - 1;
  };

  const nombreMes = hoy.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

  if (!rutina) {
    return (
      <div className="calendario-container">
        <main className="calendario-main">
          <div className="calendario-empty-card">
            <span>📭</span>
            <h3>No hay rutina generada</h3>
            <p>Primero genera una rutina desde la sección de personalización.</p>
            <button className="calendario-btn" onClick={() => navigate("/rutinas")}>
              ⚡ Generar rutina
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (rutinaFiltrada.length === 0) {
    return (
      <div className="calendario-container">
        <main className="calendario-main">
          <div className="calendario-empty-card">
            <span>📅</span>
            <h3>No quedan días este mes</h3>
            <p>Genera una nueva rutina para el próximo mes.</p>
            <button className="calendario-btn" onClick={() => navigate("/rutinas")}>
              ⚡ Nueva rutina
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="calendario-container">
      <main className="calendario-main">

        <h2>{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</h2>

        <div className="calendario-header">
          {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d, i) => (
            <div key={i} className="calendario-day-header">{d}</div>
          ))}
        </div>

        <div className="calendario-grid">
          {Array.from({ length: calcularOffset() }).map((_, i) => (
            <div key={`empty-${i}`} className="calendario-card empty" />
          ))}
          {rutinaFiltrada.map((dia, index) => {
            const fecha = new Date(dia.fecha + "T00:00:00");
            const esHoy = fecha.getTime() === hoy.getTime();

            return (
              <div
                key={index}
                className={`calendario-card
                  ${!dia.ejercicios?.length ? "calendario-rest-day" : ""}
                  ${esHoy ? "calendario-hoy" : ""}
                `}
              >
                <span className="calendario-fecha">
                  {fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  {esHoy && <span className="hoy-badge">Hoy</span>}
                </span>
                <h3>{dia.nombreDia || dia.dia}</h3>
                <h4>{dia.titulo}</h4>
                {dia.ejercicios?.length ? (
                  <ul>
                    {dia.ejercicios.map((ej, i) => (
                      <li key={i}>{ej}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="calendario-descanso">Descanso</p>
                )}
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

export default Calendario;