/**
 * @file:       chat.controller.js
 * @project:    FitRecommend
 * @brief:      Controlador encargado de generar rutinas utilizando la API local de Ollama
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */

const axios = require("axios");

// 🔧 1. Crear plantilla fija (tú controlas estructura)
const crearPlantilla = () => {
  const diasSemana = [
    "Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"
  ];

  const plantilla = [];

  for (let i = 0; i < 30; i++) {
    plantilla.push({
      dia: `Día ${i + 1}`,
      nombreDia: diasSemana[i % 7],
      titulo: "",
      ejercicios: []
    });
  }

  return plantilla;
};

// 🔧 2. Limpiar respuesta IA
const limpiarTexto = (texto) => {
  return texto
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

// 🔧 3. Integrar respuesta IA con plantilla (tolerante)
const integrarRutina = (plantilla, respuestaIA, diasEntrenamiento) => {

  if (!Array.isArray(respuestaIA)) {
    console.log("❌ IA no devolvió array");
    return null;
  }

  let entrenamientosUsados = 0;

  return plantilla.map((dia, i) => {

    // 🔁 usamos módulo para repetir semana
    const ia = respuestaIA[i % 7];

    if (!ia) {
      return {
        dia: dia.dia,
        titulo: "Descanso"
      };
    }

    if (ia.titulo === "Descanso") {
      return {
        dia: dia.dia,
        titulo: "Descanso"
      };
    }

    let ejercicios = Array.isArray(ia.ejercicios)
      ? ia.ejercicios.filter(e => typeof e === "string")
      : [];

    if (ejercicios.length > 5) {
      ejercicios = ejercicios.slice(0, 5);
    }

    return {
      dia: dia.dia,
      titulo: ia.titulo || "Entrenamiento",
      ejercicios
    };
  });
};

// 🔧 4. Controller principal
const generateRoutine = async (req, res) => {
  try {

    const { nombre, edad, peso, altura, objetivo, nivel, dias, lesiones } = req.body;

    // 🔴 Validación entrada
    if (
      typeof nombre !== "string" ||
      typeof objetivo !== "string" ||
      typeof nivel !== "string" ||
      typeof lesiones !== "string" ||
      isNaN(edad) || edad <= 0 ||
      isNaN(peso) || peso <= 0 ||
      isNaN(altura) || altura <= 0 ||
      isNaN(dias) || dias < 1 || dias > 7
    ) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const plantilla = crearPlantilla();

 const prompt = `
Devuelve SOLO un ARRAY JSON de 7 elementos.

Cada elemento debe tener:
- "titulo"
- "ejercicios" (solo si no es descanso)

Reglas:
- EXACTAMENTE ${dias} días de entrenamiento
- resto descanso
- 3 a 5 ejercicios por día
- formato: "Ejercicio - 3x10"

NO devuelvas objeto, SOLO array.
NO texto adicional.

Ejemplo:
[
  {
    "titulo": "Pecho",
    "ejercicios": ["Press banca - 3x10"]
  },
  {
    "titulo": "Descanso"
  }
]

Datos:
nombre:${nombre}
edad:${edad}
peso:${peso}
altura:${altura}
nivel:${nivel}
objetivo:${objetivo}
lesiones:${lesiones}
`;

    let parsed = null;

    // 🔁 Reintentos
    for (let i = 0; i < 3; i++) {

      try {

        const response = await axios.post(
          "http://localhost:11434/api/generate",
          {
            model: "llama3",
            prompt,
            stream: false
          }
        );

        const raw = response.data.response;
        console.log("RAW IA:", raw);

        const limpio = limpiarTexto(raw);

        try {
          parsed = JSON.parse(limpio);
          break;
        } catch (e) {
          console.log("❌ error parseando:", e.message);
        }

      } catch (err) {
        console.log("❌ error en petición:", err.message);
      }
    }

    if (!parsed) {
      return res.status(500).json({
        error: "La IA no devolvió un formato válido"
      });
    }

    const rutinaFinal = integrarRutina(plantilla, parsed, dias);

    if (!rutinaFinal) {
      return res.status(500).json({
        error: "No se pudo construir la rutina"
      });
    }

    // ✔️ respuesta final consistente
    return res.json({ rutina: rutinaFinal });

  } catch (error) {
    console.error("❌ error general:", error.message);
    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};

module.exports = { generateRoutine };