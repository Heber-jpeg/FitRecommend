import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Calendario.css";

function Calendario() {

  const navigate = useNavigate();
  const [diaVisto, setDiaVisto] = useState(null);
  const [series, setSeries] = useState({});      // { "ejIdx-serieIdx": true/false }
  const [timer, setTimer] = useState(null);       // segundos restantes
  const [timerActivo, setTimerActivo] = useState(false);
  const intervalRef = useRef(null);

  const cargada = JSON.parse(localStorage.getItem("rutinaCalendario") || "null");
  const descansoSeg = Number(cargada?.descanso || 60);

  const [rutina, setRutina] = useState(() => {
    return cargada ? cargada.rutina : null;
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

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

  const handleLimpiar = () => {
    localStorage.removeItem("rutinaCalendario");
    setRutina(null);
  };

  // Parsear series y reps del string "Ejercicio - 4x10"
  const parsearEjercicio = (ejStr) => {
    const match = ejStr.match(/^(.+?)\s*-\s*(\d+)x(\d+)(.*)$/);
    if (match) {
      return {
        nombre: match[1].trim(),
        series: Number(match[2]),
        reps:   Number(match[3]),
        extra:  match[4].trim()
      };
    }
    return { nombre: ejStr, series: 3, reps: 10, extra: "" };
  };

  // Marcar serie como completada e iniciar timer
  const handleSerie = (ejIdx, serieIdx) => {
    const key = `${ejIdx}-${serieIdx}`;
    const yaCompletada = series[key];

    setSeries(prev => ({ ...prev, [key]: !yaCompletada }));

    if (!yaCompletada) {
      iniciarTimer();
    }
  };

  const iniciarTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(descansoSeg);
    setTimerActivo(true);

    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimerActivo(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelarTimer = () => {
    clearInterval(intervalRef.current);
    setTimerActivo(false);
    setTimer(null);
  };

  // Limpiar timer al cerrar modal
  const cerrarModal = () => {
    cancelarTimer();
    setSeries({});
    setDiaVisto(null);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  if (!rutina) {
    return (
      <div className="calendario-container">
        <main className="calendario-main">
          <div className="calendario-empty-card">
            <span>📅</span>
            <h3>No hay rutina cargada</h3>
            <p>Ve a Mis Rutinas y carga una rutina para verla aquí.</p>
            <button className="calendario-btn" onClick={() => navigate("/mis-rutinas")}>
              📋 Ir a Mis Rutinas
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

        <div className="calendario-titulo-row">
          <h2>{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}</h2>
          <div className="calendario-acciones">
            <button className="calendario-btn-sm" onClick={() => navigate("/mis-rutinas")}>
              🔄 Cambiar rutina
            </button>
            <button className="calendario-btn-sm danger" onClick={handleLimpiar}>
              🗑 Limpiar
            </button>
          </div>
        </div>

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
            const esDescanso = !dia.ejercicios?.length;

            return (
              <div
                key={index}
                className={`calendario-card
                  ${esDescanso ? "calendario-rest-day" : ""}
                  ${esHoy ? "calendario-hoy" : ""}
                `}
              >
                <span className="calendario-fecha">
                  {fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                  {esHoy && <span className="hoy-badge">Hoy</span>}
                </span>
                <h3>{dia.nombreDia || dia.dia}</h3>
                <h4>{dia.titulo}</h4>
                {esDescanso ? (
                  <p className="calendario-descanso">Descanso</p>
                ) : (
                  <button
                    className="calendario-ver-btn"
                    onClick={() => setDiaVisto(dia)}
                  >
                    Ver rutina
                  </button>
                )}
              </div>
            );
          })}
        </div>

      </main>

      {/* MODAL */}
      {diaVisto && (
        <div className="calendario-modal-overlay" onClick={cerrarModal}>
          <div className="calendario-modal" onClick={(e) => e.stopPropagation()}>

            <div className="calendario-modal-header">
              <div>
                <h3>{diaVisto.titulo}</h3>
                <span className="calendario-modal-sub">
                  {diaVisto.nombreDia} — {new Date(diaVisto.fecha + "T00:00:00")
                    .toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
                </span>
              </div>
              <button className="calendario-modal-close" onClick={cerrarModal}>✕</button>
            </div>

            {/* TIMER */}
            {timerActivo && timer !== null && (
              <div className="calendario-timer">
                <div className="calendario-timer-circulo">
                  <span className="calendario-timer-seg">{timer}</span>
                  <span className="calendario-timer-label">seg</span>
                </div>
                <p className="calendario-timer-texto">⏱ Descansando...</p>
                <button className="calendario-timer-skip" onClick={cancelarTimer}>
                  Saltar descanso
                </button>
              </div>
            )}

            {!timerActivo && timer === 0 && (
              <div className="calendario-timer-listo">
                ✅ ¡Descanso completado! Siguiente serie.
              </div>
            )}

            {/* EJERCICIOS */}
            <div className="calendario-modal-ejercicios">
              {diaVisto.ejercicios.map((ejStr, ejIdx) => {
                const ej = parsearEjercicio(ejStr);
                const todasCompletadas = Array.from({ length: ej.series })
                  .every((_, si) => series[`${ejIdx}-${si}`]);

                return (
                  <div
                    key={ejIdx}
                    className={`cal-ej ${todasCompletadas ? "cal-ej-done" : ""}`}
                  >
                    <div className="cal-ej-header">
                      <span className="cal-ej-num">{ejIdx + 1}</span>
                      <div className="cal-ej-info">
                        <span className="cal-ej-nombre">{ej.nombre}</span>
                        <span className="cal-ej-meta">
                          {ej.series} series × {ej.reps} reps
                          {ej.extra && ` ${ej.extra}`}
                        </span>
                      </div>
                      {todasCompletadas && (
                        <span className="cal-ej-check">✓</span>
                      )}
                    </div>

                    <div className="cal-ej-series">
                      {Array.from({ length: ej.series }).map((_, si) => {
                        const key = `${ejIdx}-${si}`;
                        const completada = !!series[key];
                        return (
                          <button
                            key={si}
                            className={`cal-serie-btn ${completada ? "completada" : ""}`}
                            onClick={() => handleSerie(ejIdx, si)}
                          >
                            <span className="cal-serie-num">Serie {si + 1}</span>
                            <span className="cal-serie-reps">{ej.reps} reps</span>
                            {completada && <span className="cal-serie-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendario;