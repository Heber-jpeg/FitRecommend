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
