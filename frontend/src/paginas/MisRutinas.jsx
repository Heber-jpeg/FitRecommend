import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

import "./css/MisRutinas.css";

function MisRutinas() {

  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [descripcion, setDescripcion] = useState({});
  const [compartiendo, setCompartiendo] = useState({});
  const [exito, setExito] = useState({});
  const [rutinaVista, setRutinaVista] = useState(null);

  useEffect(() => {
    const perfil = localStorage.getItem("perfil");
    if (!perfil) { navigate("/rutinas"); return; }
    const { nombre } = JSON.parse(perfil);
    apiFetch("/mis-rutinas")

      .then(r => r.json())
      .then(data => setRutinas(data.rutinas || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCargarEnCalendario = (rutina) => {
    localStorage.setItem("rutinaCalendario", JSON.stringify({
      rutina: rutina.rutina,
      descanso: rutina.opciones.descanso  // ← agrega esto
    }));
    navigate("/calendario");
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta rutina?")) return;
    try {
      const res = await apiFetch(`/mis-rutinas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRutinas(prev => prev.filter(r => r._id !== id));
    } catch {
      alert("Error al eliminar la rutina");
    }
  };

  const handleCompartir = async (rutina) => {
    const desc = descripcion[rutina._id];
    if (!desc?.trim()) {
      alert("Escribe una descripción antes de compartir");
      return;
    }
    setCompartiendo(prev => ({ ...prev, [rutina._id]: true }));
    try {
      const res = await apiFetch("/compartir", {   
        method: "POST",
        body: JSON.stringify({ rutinaId: rutina._id, descripcion: desc })
      });
      if (!res.ok) throw new Error();
      setExito(prev => ({ ...prev, [rutina._id]: true }));
    } catch {
      alert("Error al compartir");
    } finally {
      setCompartiendo(prev => ({ ...prev, [rutina._id]: false }));
    }
  };

  const objetivoLabel = {
    musculo:      "Ganar músculo",
    perder_grasa: "Perder grasa",
    resistencia:  "Resistencia"
  };

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric", month: "long", year: "numeric"
    });

  if (loading) return (
    <div className="misrutinas-container">
      <p className="misrutinas-loading">Cargando tus rutinas...</p>
    </div>
  );

  if (rutinas.length === 0) return (
    <div className="misrutinas-container">
      <div className="misrutinas-empty">
        <span>📭</span>
        <h3>No tienes rutinas guardadas</h3>
        <p>Genera tu primera rutina para verla aquí.</p>
        <button onClick={() => navigate("/rutinas")}>⚡ Generar rutina</button>
      </div>
    </div>
  );

  return (
    <div className="misrutinas-container">

      <h2>Mis rutinas</h2>

      <div className="misrutinas-grid">
        {rutinas.map((rutina) => (
          <div key={rutina._id} className="misrutinas-card">

            <div className="misrutinas-card-header">
              <div>
                <span className="misrutinas-badge">
                  {objetivoLabel[rutina.usuario.objetivo] || rutina.usuario.objetivo}
                </span>
                <span className="misrutinas-badge nivel">
                  {rutina.usuario.nivel}
                </span>
              </div>
              <span className="misrutinas-fecha">{formatFecha(rutina.creadoEn)}</span>
            </div>

            <div className="misrutinas-detalles">
              <span>⏱ {rutina.opciones.descanso}s descanso</span>
              <span>🕐 {rutina.opciones.duracion} min</span>
              <span>🔥 {rutina.opciones.intensidad}</span>
              <span>🏋️ {rutina.opciones.equipamiento}</span>
            </div>

            <div className="misrutinas-acciones">
              <button
                className="misrutinas-btn-accion cargar"
                onClick={() => handleCargarEnCalendario(rutina)}
              >
                📅 Cargar
              </button>
              <button
                className="misrutinas-btn-accion ver"
                onClick={() => setRutinaVista(rutina)}
              >
                👁 Ver
              </button>
              <button
                className="misrutinas-btn-accion eliminar"
                onClick={() => handleEliminar(rutina._id)}
              >
                🗑 Eliminar
              </button>
            </div>

            <div className="misrutinas-divider" />

            {exito[rutina._id] ? (
              <p className="misrutinas-exito">✅ Rutina compartida en el blog</p>
            ) : (
              <>
                <textarea
                  className="misrutinas-textarea"
                  placeholder="Escribe una descripción para compartir..."
                  value={descripcion[rutina._id] || ""}
                  onChange={(e) => setDescripcion(prev => ({
                    ...prev,
                    [rutina._id]: e.target.value
                  }))}
                />
                <button
                  className="misrutinas-btn"
                  onClick={() => handleCompartir(rutina)}
                  disabled={compartiendo[rutina._id]}
                >
                  {compartiendo[rutina._id] ? "Compartiendo..." : "🌐 Compartir rutina"}
                </button>
              </>
            )}

          </div>
        ))}
      </div>

      {/* MODAL VER RUTINA */}
{rutinaVista && (
  <div className="misrutinas-modal-overlay" onClick={() => setRutinaVista(null)}>
    <div className="misrutinas-modal" onClick={(e) => e.stopPropagation()}>

      <div className="misrutinas-modal-header">
        <div>
          <h3>Rutina completa</h3>
          <span className="misrutinas-modal-fecha">
            {formatFecha(rutinaVista.creadoEn)}
          </span>
        </div>
        <button
          className="misrutinas-modal-close"
          onClick={() => setRutinaVista(null)}
        >
          ✕
        </button>
      </div>

      <div className="misrutinas-modal-badges">
        <span className="misrutinas-badge">
          {objetivoLabel[rutinaVista.usuario.objetivo] || rutinaVista.usuario.objetivo}
        </span>
        <span className="misrutinas-badge nivel">{rutinaVista.usuario.nivel}</span>
        <span className="misrutinas-badge">⏱ {rutinaVista.opciones.descanso}s</span>
        <span className="misrutinas-badge">🕐 {rutinaVista.opciones.duracion} min</span>
        <span className="misrutinas-badge">🔥 {rutinaVista.opciones.intensidad}</span>
        <span className="misrutinas-badge">🏋️ {rutinaVista.opciones.equipamiento}</span>
      </div>

      {/* GRUPOS ÚNICOS */}
      <div className="misrutinas-modal-grupos">
        {(() => {
          // Agrupa días por título, descartando Descanso y duplicados
          const grupos = {};
          rutinaVista.rutina.forEach((dia) => {
            if (dia.titulo === "Descanso" || !dia.ejercicios?.length) return;
            if (!grupos[dia.titulo]) {
              grupos[dia.titulo] = dia.ejercicios;
            }
          });

          return Object.entries(grupos).map(([titulo, ejercicios]) => (
            <div key={titulo} className="misrutinas-modal-grupo">
              <h4 className="misrutinas-modal-grupo-titulo">{titulo}</h4>
              <ul className="misrutinas-modal-grupo-lista">
                {ejercicios.map((ej, i) => (
                  <li key={i} className="misrutinas-modal-grupo-item">
                    <span className="misrutinas-modal-grupo-num">{i + 1}</span>
                    {ej}
                  </li>
                ))}
              </ul>
            </div>  
          ));
        })()}
      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default MisRutinas;