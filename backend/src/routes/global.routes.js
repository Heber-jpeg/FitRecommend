const express = require("express");
const router = express.Router();
const {
  compartirRutina,
  obtenerRutinasGlobales,
  obtenerMisRutinas,
  eliminarRutina,
  guardarRutinaGlobal 
} = require("../controllers/global.controller");

router.post("/compartir",  compartirRutina);
router.get("/globales",    obtenerRutinasGlobales);
router.get("/mis-rutinas", obtenerMisRutinas);
router.delete("/mis-rutinas/:id", eliminarRutina);
router.post("/guardar-global", guardarRutinaGlobal);


module.exports = router;