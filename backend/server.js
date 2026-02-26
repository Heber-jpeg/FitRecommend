/**
 * @file:       server.js
 * @project:    FitRecommend
 * @brief:      Punto de arranque del servidor
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */

const app = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});



//prueba manueal de ollama(esto no va aqui)
const axios = require("axios");

async function test() {
  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "llama3",
      prompt: "Crea una rutina de fuerza",
      stream: false
    }
  );

  console.log(response.data.response);
}

test();
