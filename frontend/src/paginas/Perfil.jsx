import "../paginas/css/Perfil.css";
import { useState, useEffect } from "react";

function Perfil({ onGuardado }) {

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");
  const [dias, setDias] = useState("");
  const [lesiones, setLesiones] = useState("");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const perfilGuardado = localStorage.getItem("perfil");
    if (perfilGuardado) {
      const datos = JSON.parse(perfilGuardado);
      setNombre(datos.nombre || "");
      setEdad(datos.edad || "");
      setPeso(datos.peso || "");
      setAltura(datos.altura || "");
      setObjetivo(datos.objetivo || "");
      setNivel(datos.nivel || "");
      setDias(datos.dias || "");
      setLesiones(datos.lesiones || "");
      setGuardado(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (guardado) {
      setGuardado(false);
      return;
    }

    const perfil = {
      nombre,
      edad,
      peso,
      altura,
      objetivo,
      nivel,
      dias,
      lesiones,
      fechaInicio: new Date().toISOString().split("T")[0]
    };

    localStorage.setItem("perfil", JSON.stringify(perfil));
    setGuardado(true);

    // ✅ Avisar al padre que se guardó
    if (onGuardado) onGuardado(perfil);
  };

  return (
    <div className="perfil-container">
      <h2>Completa tu perfil</h2>
      <form onSubmit={handleSubmit} className="perfil-form">

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={guardado}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          disabled={guardado}
          required
        />
        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          disabled={guardado}
          required
        />
        <input
          type="number"
          placeholder="Altura (cm)"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          disabled={guardado}
          required
        />

        <select
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          disabled={guardado}
          required
        >
          <option value="">Selecciona tu objetivo</option>
          <option value="musculo">Ganar músculo</option>
          <option value="perder_grasa">Perder grasa</option>
          <option value="resistencia">Resistencia</option>
        </select>

        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          disabled={guardado}
          required
        >
          <option value="">Nivel</option>
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <input
          type="number"
          placeholder="Días disponibles por semana"
          value={dias}
          onChange={(e) => setDias(e.target.value)}
          disabled={guardado}
          min="1"
          max="7"
          required
        />
        <input
          type="text"
          placeholder="Lesiones o limitaciones"
          value={lesiones}
          onChange={(e) => setLesiones(e.target.value)}
          disabled={guardado}
        />

        <button type="submit">
          {guardado ? "Editar perfil" : "Guardar perfil"}
        </button>

      </form>
    </div>
  );
}

export default Perfil;