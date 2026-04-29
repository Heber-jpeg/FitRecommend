import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Rutinas.css";

function Rutinas() {

  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();

  const [opciones, setOpciones] = useState({
    descanso: "60",
    duracion: "45",
    intensidad: "moderada",
    equipamiento: "gimnasio"
  });

  const handleOpciones = (e) => {
    setOpciones({ ...opciones, [e.target.name]: e.target.value });
  };

  const generarRutina = async () => {
    const perfilRaw = localStorage.getItem("perfil");
    if (!perfilRaw) {
      alert("Primero debes completar tu perfil");
      return;
    }
    const p = JSON.parse(perfilRaw);
    const body = {
      nombre:       p.nombre,
      edad:         Number(p.edad),
      peso:         Number(p.peso),
      altura:       Number(p.altura),
      objetivo:     p.objetivo,
      nivel:        p.nivel,
      dias:         Number(p.dias),
      lesiones:     p.lesiones || "",
      fechaInicio:  p.fechaInicio || new Date().toISOString().split("T")[0],
      descanso:     opciones.descanso,
      duracion:     opciones.duracion,
      intensidad:   opciones.intensidad,
      equipamiento: opciones.equipamiento
    };
    try {
      setLoading(true);
      setExito(false);
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      localStorage.setItem("rutinaGenerada", JSON.stringify(data));
      setExito(true);
    } catch (error) {
      console.error(error);
      alert("Error generando la rutina");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rutina-container">
      <main className="rutina-main">

        <h2>Personaliza tu rutina</h2>

        <div className="opciones-form">

          <div className="opciones-grid">

            <div className="opcion-grupo">
              <label>⏱ Descanso entre series</label>
              <select name="descanso" value={opciones.descanso} onChange={handleOpciones}>
                <option value="30">30 segundos</option>
                <option value="60">1 minuto</option>
                <option value="90">1:30 minutos</option>
                <option value="120">2 minutos</option>
                <option value="180">3 minutos</option>
              </select>
            </div>

            <div className="opcion-grupo">
              <label>🕐 Duración de sesión</label>
              <select name="duracion" value={opciones.duracion} onChange={handleOpciones}>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="75">1:15 horas</option>
                <option value="90">1:30 horas</option>
              </select>
            </div>

            <div className="opcion-grupo">
              <label>🔥 Intensidad (RPE)</label>
              <select name="intensidad" value={opciones.intensidad} onChange={handleOpciones}>
                <option value="baja">Baja — RPE 4-5</option>
                <option value="moderada">Moderada — RPE 6-7</option>
                <option value="alta">Alta — RPE 8-9</option>
                <option value="maxima">Máxima — RPE 10</option>
              </select>
            </div>

            <div className="opcion-grupo">
              <label>🏋️ Equipamiento</label>
              <select name="equipamiento" value={opciones.equipamiento} onChange={handleOpciones}>
                <option value="gimnasio">Gimnasio completo</option>
                <option value="casa">En casa sin equipo</option>
                <option value="mancuernas">Mancuernas</option>
                <option value="bandas">Bandas elásticas</option>
                <option value="calistenia">Calistenia</option>
              </select>
            </div>

          </div>

          <div className="botones-rutina">
            <button className="btn-generar" onClick={generarRutina} disabled={loading}>
              {loading ? "Generando..." : "⚡ Generar rutina"}
            </button>
          </div>

        </div>

        {loading && <p className="generando">Generando rutina, esto puede tardar unos segundos...</p>}

        {/* MENSAJE DE ÉXITO */}
        {exito && !loading && (
          <div className="exito-card">
            <span className="exito-icono">✅</span>
            <h3>¡Rutina generada con éxito!</h3>
            <p>Tu rutina mensual está lista. Puedes verla en Mis Rutinas.</p>
            <button className="btn-generar" onClick={() => navigate("/mis-rutinas")}>
              📋 Ver mi rutina
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default Rutinas;