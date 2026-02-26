import { useState } from "react";

function PerfilForm({ setPerfil }) {
  const [edad, setEdad] = useState("");
  const [nivel, setNivel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPerfil({ edad, nivel });
  };

  return (
    <div className="form-container">
      <h2>Ingresa tu perfil</h2>

      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
      />

      <select
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
      >
        <option value="">Selecciona tu nivel</option>
        <option value="principiante">Principiante</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
      </select>

      <button onClick={handleSubmit}>Generar rutina</button>
    </div>
  );
}

export default PerfilForm;