function PerfilForm({ cerrarPerfil }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Completa tu perfil</h2>

        <input type="text" placeholder="Nombre" />
        <input type="number" placeholder="Edad" />
        <input type="number" placeholder="Peso (kg)" />
        <input type="number" placeholder="Altura (cm)" />

        <select>
          <option>Selecciona objetivo</option>
          <option>Bajar peso</option>
          <option>Ganar músculo</option>
          <option>Mantener forma</option>
        </select>

        <button>Guardar</button>
        <button className="cerrar" onClick={cerrarPerfil}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default PerfilForm;