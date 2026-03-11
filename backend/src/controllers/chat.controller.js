/**
 * @file:       chat.controller.js
 * @project:    FitRecommend
 * @brief:      Controlador encargado de generar rutinas utilizando la API local de Ollama
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */

const axios = require("axios");

const generateRoutine = async (req, res) => {
  try {

    const { nombre, edad, peso, altura, objetivo, nivel, dias, lesiones } = req.body;

    // Validación robusta del body
    if ( !nombre || !edad || !peso || !altura || !objetivo || !nivel || !dias || !lesiones ) {
      return res.status(400).json({
        error: "Datos incompletos"
      });
    }

    const prompt = `

    Genera una rutina de entrenamiento semanal personalizada.

    Datos del usuario:

    nombre: ${nombre}
    edad: ${edad}
    peso: ${peso} kg
    altura: ${altura} cm
    nivel: ${nivel}
    objetivo: ${objetivo}
    lesiones: ${lesiones}
    dias_entrenamiento: ${dias}

    Reglas obligatorias:

    1. La rutina debe contener EXACTAMENTE 7 objetos (uno por cada día).
    2. Los días deben aparecer en este orden exacto:

    Lunes
    Martes
    Miercoles
    Jueves
    Viernes
    Sabado
    Domingo

    3. Solo ${dias} días deben ser de entrenamiento.
    4. Los demás días deben ser descanso.
    5. Si el día es entrenamiento:
      - Debe incluir "titulo" con el grupo muscular trabajado.
      - Debe incluir entre 3 y 5 ejercicios.
    6. Cada ejercicio debe tener este formato:
      "nombre ejercicio - series x repeticiones"

    Ejemplo:
    "Sentadilla - 3x10"

    7. Si el día es descanso:
      - solo incluye:
      {
        "dia": "Martes",
        "titulo": "Descanso"
      }

    8. Considera el nivel, objetivo y lesiones.

    Responde SOLO con JSON válido.

    Formato exacto:

    {
      "rutina":[
        {
          "dia":"Lunes",
          "titulo":"grupo muscular",
          "ejercicios":[
            "ejercicio - 3x10"
          ]
        }
      ]
    }

    NO escribas explicaciones.
    NO escribas texto fuera del JSON.

    `;

    

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: prompt,
        stream: false
      },
      {
        timeout: 3000000 // evita que quede colgado indefinidamente
      }
    );

    // Devolver solo el texto generado
    return res.status(200).json({
      response: response.data.response
    });
    
    console.log(response);

  } catch (error) {
    console.error("Error al comunicarse con Ollama:", error.message);

    return res.status(500).json({
      error: "Error al comunicarse con el servicio de generación"
    });
  }
};

module.exports = { generateRoutine };