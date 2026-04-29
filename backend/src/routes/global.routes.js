const express = require("express");
const router = express.Router();
const {
  compartirRutina,
  obtenerRutinasGlobales,
  obtenerMisRutinas,
  eliminarRutina 
} = require("../controllers/global.controller");

router.post("/compartir",  compartirRutina);
router.get("/globales",    obtenerRutinasGlobales);
router.get("/mis-rutinas", obtenerMisRutinas);
router.delete("/mis-rutinas/:id", eliminarRutina);


module.exports = router;