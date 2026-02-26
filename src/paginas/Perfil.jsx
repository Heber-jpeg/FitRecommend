import { useState } from "react";

function Perfil() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const perfil = {
      nombre,
      edad,
      objetivo,
    };

    console.log("Perfil guardado:", perfil);

    alert("Perfil guardado correctamente");
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
        />

        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />

        <select
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          required
        >
          <option value="">Selecciona tu objetivo</option>
          <option value="musculo">Ganar músculo</option>
          <option value="perder_grasa">Perder grasa</option>
          <option value="resistencia">Resistencia</option>
        </select>

        <button type="submit">Guardar Perfil</button>
      </form>
    </div>
  );
}

export default Perfil;