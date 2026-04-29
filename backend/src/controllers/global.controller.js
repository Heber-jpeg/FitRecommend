const RutinaGlobal = require("../models/RutinaGlobal.model");
const Rutina = require("../models/Rutina.model");

// Compartir una rutina de MisRutinas a rutinasGlobales
const compartirRutina = async (req, res) => {
  try {
    const { rutinaId, descripcion } = req.body;

    console.log("📥 Body recibido:", req.body);  // ← verifica que llegan los datos

    if (!rutinaId || !descripcion) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const rutina = await Rutina.findById(rutinaId);
    console.log("🔍 Rutina encontrada:", rutina);  // ← verifica que encuentra la rutina

    if (!rutina) {
      return res.status(404).json({ error: "Rutina no encontrada" });
    }

    const nueva = await RutinaGlobal.create({
      autor:       rutina.usuario.nombre,
      descripcion,
      nivel:       rutina.usuario.nivel,
      objetivo:    rutina.usuario.objetivo,
      opciones:    rutina.opciones,
      rutina:      rutina.rutina
    });

    console.log("✅ Guardada en rutinasGlobales:", nueva._id);  // ← verifica que se guardó

    return res.json({ ok: true, id: nueva._id });

  } catch (error) {
    console.error("❌ error compartir:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

// Obtener todas las rutinas globales para el blog
const obtenerRutinasGlobales = async (req, res) => {
  try {
    const rutinas = await RutinaGlobal.find()
      .sort({ creadoEn: -1 })
      // ❌ antes solo traía algunos campos
      // ahora trae todo
    
    return res.json({ rutinas });
  } catch (error) {
    console.error("❌ error obteniendo globales:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};
// Obtener rutinas guardadas del usuario (MisRutinas)
const obtenerMisRutinas = async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({ error: "Falta nombre" });
    }

    const rutinas = await Rutina.find({ "usuario.nombre": nombre })
      .sort({ creadoEn: -1 })
      .select("usuario opciones rutina creadoEn");

    return res.json({ rutinas });
  } catch (error) {
    console.error("❌ error obteniendo mis rutinas:", error.message);
    return res.status(500).json({ error: "Error interno" });
  }
};

module.exports = { compartirRutina, obtenerRutinasGlobales, obtenerMisRutinas };