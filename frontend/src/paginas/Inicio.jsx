import { useState, useEffect } from "react";
import "./css/Inicio.css";

function Inicio() {

  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState({});
  const [guardado, setGuardado] = useState({});
  const [rutinaVista, setRutinaVista] = useState(null); // ← modal

  const [filtroObjetivo, setFiltroObjetivo] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [filtroEquipamiento, setFiltroEquipamiento] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/globales")
      .then(r => r.json())
      .then(data => setRutinas(data.rutinas || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleGuardar = async (rutina) => {
    const perfil = localStorage.getItem("perfil");
    if (!perfil) {
      alert("Primero completa tu perfil para guardar rutinas");
      return;
    }
    const { nombre } = JSON.parse(perfil);
    setGuardando(prev => ({ ...prev, [rutina._id]: true }));
    try {
      const res = await fetch("http://localhost:3000/api/guardar-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rutinaGlobalId: rutina._id, nombreUsuario: nombre })
      });
      if (!res.ok) throw new Error();
      setGuardado(prev => ({ ...prev, [rutina._id]: true }));
    } catch {
      alert("Error al guardar la rutina");
    } finally {
      setGuardando(prev => ({ ...prev, [rutina._id]: false }));
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

  const rutinasFiltradas = rutinas.filter(r => {
    const matchObjetivo     = filtroObjetivo     === "todos" || r.objetivo === filtroObjetivo;
    const matchNivel        = filtroNivel        === "todos" || r.nivel === filtroNivel;
    const matchEquipamiento = filtroEquipamiento === "todos" || r.opciones?.equipamiento === filtroEquipamiento;
    const matchBusqueda     = busqueda === "" ||
      r.autor?.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return matchObjetivo && matchNivel && matchEquipamiento && matchBusqueda;
  });

  const limpiarFiltros = () => {
    setFiltroObjetivo("todos");
    setFiltroNivel("todos");
    setFiltroEquipamiento("todos");
    setBusqueda("");
  };

  const hayFiltros = filtroObjetivo !== "todos" ||
    filtroNivel !== "todos" ||
    filtroEquipamiento !== "todos" ||
    busqueda !== "";

  // Agrupar ejercicios únicos por título
  const agruparEjercicios = (rutina) => {
    const grupos = {};
    rutina?.forEach((dia) => {
      if (dia.titulo === "Descanso" || !dia.ejercicios?.length) return;
      if (!grupos[dia.titulo]) grupos[dia.titulo] = dia.ejercicios;
    });
    return grupos;
  };

  return (
    <div className="inicio-container">

      <div className="inicio-hero">
        <h1>Bienvenido a <span>FitRecommend</span> 💪</h1>
        <p>Rutinas personalizadas generadas con IA. Explora lo que la comunidad está entrenando.</p>
      </div>

      <div className="inicio-blog">

        <h2>Rutinas de la comunidad</h2>

        <div className="inicio-filtros">
          <input
            className="inicio-busqueda"
            type="text"
            placeholder="🔍 Buscar por autor o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="inicio-filtros-row">
            <select className="inicio-select" value={filtroObjetivo} onChange={(e) => setFiltroObjetivo(e.target.value)}>
              <option value="todos">🎯 Todos los objetivos</option>
              <option value="musculo">Ganar músculo</option>
              <option value="perder_grasa">Perder grasa</option>
              <option value="resistencia">Resistencia</option>
            </select>
            <select className="inicio-select" value={filtroNivel} onChange={(e) => setFiltroNivel(e.target.value)}>
              <option value="todos">📊 Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <select className="inicio-select" value={filtroEquipamiento} onChange={(e) => setFiltroEquipamiento(e.target.value)}>
              <option value="todos">🏋️ Todo el equipamiento</option>
              <option value="gimnasio">Gimnasio</option>
              <option value="casa">En casa</option>
              <option value="mancuernas">Mancuernas</option>
              <option value="bandas">Bandas elásticas</option>
              <option value="calistenia">Calistenia</option>
            </select>
            {hayFiltros && (
              <button className="inicio-limpiar" onClick={limpiarFiltros}>✕ Limpiar</button>
            )}
          </div>
        </div>

        {loading && <div className="inicio-empty"><span>⏳</span><p>Cargando rutinas...</p></div>}
        {!loading && error && <div className="inicio-empty"><span>⚠️</span><p>No se pudieron cargar las rutinas.</p></div>}

        {!loading && !error && rutinasFiltradas.length === 0 && (
          <div className="inicio-empty">
            <span>🔍</span>
            <p>{hayFiltros ? "No hay rutinas que coincidan con los filtros." : "Aún no hay rutinas compartidas. ¡Sé el primero!"}</p>
            {hayFiltros && <button className="inicio-limpiar-empty" onClick={limpiarFiltros}>Limpiar filtros</button>}
          </div>
        )}

        {!loading && !error && rutinasFiltradas.length > 0 && (
          <>
            <p className="inicio-resultado">
              {rutinasFiltradas.length} rutina{rutinasFiltradas.length !== 1 ? "s" : ""} encontrada{rutinasFiltradas.length !== 1 ? "s" : ""}
            </p>

            <div className="inicio-grid">
              {rutinasFiltradas.map((r) => (
                <div key={r._id} className="inicio-card">

                  <div className="inicio-card-top">
                    <div className="inicio-avatar">
                      {r.autor?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <span className="inicio-autor">{r.autor ?? "Anónimo"}</span>
                      <span className="inicio-fecha">{r.creadoEn ? formatFecha(r.creadoEn) : ""}</span>
                    </div>
                  </div>

                  <p className="inicio-descripcion">{r.descripcion ?? ""}</p>

                  <div className="inicio-badges">
                    <span className="inicio-badge">{objetivoLabel[r.objetivo] ?? r.objetivo ?? ""}</span>
                    <span className="inicio-badge nivel">{r.nivel ?? ""}</span>
                  </div>

                  <div className="inicio-detalles">
                    <span>⏱ {r.opciones?.descanso ?? "-"}s</span>
                    <span>🕐 {r.opciones?.duracion ?? "-"} min</span>
                    <span>🔥 {r.opciones?.intensidad ?? "-"}</span>
                    <span>🏋️ {r.opciones?.equipamiento ?? "-"}</span>
                  </div>

                  {/* BOTONES */}
                  <div className="inicio-card-acciones">
                    <button
                      className="inicio-btn-ver"
                      onClick={() => setRutinaVista(r)}
                    >
                      👁 Ver rutina
                    </button>

                    {guardado[r._id] ? (
                      <p className="inicio-guardado">✅ Guardada</p>
                    ) : (
                      <button
                        className="inicio-btn-guardar"
                        onClick={() => handleGuardar(r)}
                        disabled={guardando[r._id]}
                      >
                        {guardando[r._id] ? "Guardando..." : "💾 Guardar"}
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* MODAL VER RUTINA */}
      {rutinaVista && (
        <div className="inicio-modal-overlay" onClick={() => setRutinaVista(null)}>
          <div className="inicio-modal" onClick={(e) => e.stopPropagation()}>

            <div className="inicio-modal-header">
              <div>
                <h3>Rutina de {rutinaVista.autor}</h3>
                <span className="inicio-modal-sub">{rutinaVista.descripcion}</span>
              </div>
              <button className="inicio-modal-close" onClick={() => setRutinaVista(null)}>✕</button>
            </div>

            <div className="inicio-modal-badges">
              <span className="inicio-badge">{objetivoLabel[rutinaVista.objetivo] || rutinaVista.objetivo}</span>
              <span className="inicio-badge nivel">{rutinaVista.nivel}</span>
              <span className="inicio-badge">⏱ {rutinaVista.opciones?.descanso}s</span>
              <span className="inicio-badge">🕐 {rutinaVista.opciones?.duracion} min</span>
              <span className="inicio-badge">🔥 {rutinaVista.opciones?.intensidad}</span>
              <span className="inicio-badge">🏋️ {rutinaVista.opciones?.equipamiento}</span>
            </div>

            <div className="inicio-modal-grupos">
              {Object.entries(agruparEjercicios(rutinaVista.rutina)).map(([titulo, ejercicios]) => (
                <div key={titulo} className="inicio-modal-grupo">
                  <h4 className="inicio-modal-grupo-titulo">{titulo}</h4>
                  <ul className="inicio-modal-grupo-lista">
                    {ejercicios.map((ej, i) => (
                      <li key={i} className="inicio-modal-grupo-item">
                        <span className="inicio-modal-grupo-num">{i + 1}</span>
                        {ej}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Inicio;