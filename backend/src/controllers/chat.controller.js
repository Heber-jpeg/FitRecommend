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

    lesiones: ${lesiones}

    Hola ollama, mi mobre es ${nombre}, tengo ${edad} años, peso ${peso} kg
    mi altura es ${altura} cm y mi objetivo es ${objetivo}, ten en cuenta que
    soy nivel ${nivel} tambien ten en cuenta si tengo lesiones previas, genera
    una rutina de ${dias} por semana que se adapte a mis caracteristicas fisicas
    y a mis objetivos
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