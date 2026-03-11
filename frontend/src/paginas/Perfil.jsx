import { useState, useEffect } from "react";
import ".//css/Perfil.css";

function Perfil() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");
  const [dias, setDias] = useState("");
  const [lesiones, setLesiones] = useState("");
  const [guardado, setGuardado] = useState(false);

  // 🔥 Cargar datos guardados
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

  const handleSubmit = async (e) => {
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
    };

    try {
      const respuesta = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(perfil),
      });

      const data = await respuesta.json();
      console.log(data);

      // Guardar perfil actualizado
      localStorage.setItem("perfil", JSON.stringify(perfil));

      // Guardar nueva rutina generada
      localStorage.setItem("rutinaGenerada", JSON.stringify(data));

      alert("Perfil actualizado y rutina regenerada ✅");
      setGuardado(true);

    } catch (error) {
      console.error("Error:", error);
    }
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
          required
          disabled={guardado}
        />

        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
          disabled={guardado}
        />

        <input
          type="number"
          placeholder="Peso (kg)"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          required
          disabled={guardado}
        />

        <input
          type="number"
          placeholder="Altura (cm)"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          required
          disabled={guardado}
        />

        <select
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          required
          disabled={guardado}
        >
          <option value="">Selecciona tu objetivo</option>
          <option value="musculo">Ganar músculo</option>
          <option value="perder_grasa">Perder grasa</option>
          <option value="resistencia">Ganar resistencia</option>
        </select>

        {/* 🔥 NUEVOS CAMPOS */}

        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          required
          disabled={guardado}
        >
          <option value="">Nivel de experiencia</option>
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <input
          type="number"
          placeholder="Días disponibles por semana (1-7)"
          value={dias}
          onChange={(e) =>setDias(e.target.value)}
          required
          disabled={guardado}
          min="1"
          max="7"
        />

        <input
          type="text"
          placeholder="¿Tienes alguna lesión o limitación?"
          value={lesiones}
          onChange={(e) => setLesiones(e.target.value)}
          disabled={guardado}
        />

        <button type="submit">
          {guardado ? "Editar Perfil" : "Guardar Perfil"}
        </button>

      </form>
    </div>
  );
}

export default Perfil;