/**
 * @file:       app.js
 * @project:    FitRecommend
 * @brief:      Configuración principal de la aplicación Express y registro de rutas
 * @author:     Jesus Rojas
 * @date:       25-02-2026
 */


const express = require("express");
const app = express();

app.use(express.json());

const chatRoutes = require("./routes/chat.routes");

app.use("/api", chatRoutes);

module.exports = app;
