const express = require("express");
const router = express.Router();
const {
  compartirRutina,
  obtenerRutinasGlobales,
  obtenerMisRutinas
} = require("../controllers/global.controller");

router.post("/compartir",  compartirRutina);
router.get("/globales",    obtenerRutinasGlobales);
router.get("/mis-rutinas", obtenerMisRutinas);

module.exports = router;