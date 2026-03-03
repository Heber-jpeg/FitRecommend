import { useState } from "react";

function Perfil() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const perfil = {
      nombre,
      edad,
      peso,
      altura,
      objetivo,
    };

      try {
      const respuesta = await fetch("http://localhost:5173/perfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(perfil),
      });

      const data = await respuesta.json();
      console.log(data);
      alert("Perfil enviado al backend");

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
        />

        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />

        <input 
           type="number"
           placeholder="Peso(kg)"
           value={peso}
           onChange={(e) => setPeso(e.target.value)}
           required
        />

        <input
           type="number"
           placeholder="Altura(cm)"
           value={altura}
           onChange={(e) => setAltura(e.target.value)}
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
          <option value="resistencia">Ganar resistencia</option>
        </select>

        <button type="submit">Guardar Perfil</button>
      </form>
    </div>
  );
  
}

export default Perfil;