function Recomendaciones({ perfil }) {
  if (!perfil) return null;

  let ejercicios = [];

  if (perfil.nivel === "principiante") {
    ejercicios = ["Caminata 20 min", "Sentadillas", "Flexiones"];
  } else if (perfil.nivel === "intermedio") {
    ejercicios = ["Trote 30 min", "Plancha 1 min", "Burpees"];
  } else if (perfil.nivel === "avanzado") {
    ejercicios = ["HIIT", "Peso muerto", "Sprint 15 min"];
  }

  return (
    <div className="recomendaciones">
      <h2>Tu rutina recomendada:</h2>
      <ul>
        {ejercicios.map((ejercicio, index) => (
          <li key={index}>{ejercicio}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recomendaciones;