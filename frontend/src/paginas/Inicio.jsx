import { useState, useEffect } from "react";
import "./css/Inicio.css";

function Inicio() {

  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/globales")
      .then(r => r.json())
      .then(data => setRutinas(data.rutinas || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const objetivoLabel = {
    musculo:      "Ganar músculo",
    perder_grasa: "Perder grasa",
    resistencia:  "Resistencia"
  };

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric", month: "long", year: "numeric"
    });

  return (
    <div className="inicio-container">

      {/* HERO */}
      <div className="inicio-hero">
        <h1>Bienvenido a <span>FitRecommend</span> 💪</h1>
        <p>Rutinas personalizadas generadas con IA. Explora lo que la comunidad está entrenando.</p>
      </div>

      {/* BLOG */}
      <div className="inicio-blog">

        <h2>Rutinas de la comunidad</h2>

        {loading && <p className="inicio-loading">Cargando rutinas...</p>}

        {!loading && rutinas.length === 0 && (
          <div className="inicio-empty">
            <span>🏋️</span>
            <p>Aún no hay rutinas compartidas. ¡Sé el primero!</p>
          </div>
        )}

        <div className="inicio-grid">
          {rutinas.map((r) => (
            <div key={r._id} className="inicio-card">

              <div className="inicio-card-top">
                <div className="inicio-avatar">
                  {r.autor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="inicio-autor">{r.autor}</span>
                  <span className="inicio-fecha">{formatFecha(r.creadoEn)}</span>
                </div>
              </div>

              <p className="inicio-descripcion">{r.descripcion}</p>

              <div className="inicio-badges">
                <span className="inicio-badge">
                  {objetivoLabel[r.objetivo] || r.objetivo}
                </span>
                <span className="inicio-badge nivel">{r.nivel}</span>
              </div>

              <div className="inicio-detalles">
                <span>⏱ {r.opciones.descanso}s</span>
                <span>🕐 {r.opciones.duracion} min</span>
                <span>🔥 {r.opciones.intensidad}</span>
                <span>🏋️ {r.opciones.equipamiento}</span>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Inicio;