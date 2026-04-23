const mongoose = require("mongoose");

const ejercicioSchema = new mongoose.Schema({
  nombre: String
});

const diaSchema = new mongoose.Schema({
  dia:       String,
  fecha:     String,
  nombreDia: String,
  titulo:    String,
  ejercicios: [String]
});

const rutinaSchema = new mongoose.Schema({
  usuario: {
    nombre:       String,
    edad:         Number,
    peso:         Number,
    altura:       Number,
    objetivo:     String,
    nivel:        String,
    dias:         Number,
    lesiones:     String,
    fechaInicio:  String
  },
  opciones: {
    descanso:     String,
    duracion:     String,
    intensidad:   String,
    equipamiento: String
  },
  rutina: [diaSchema],
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Rutina", rutinaSchema, "MisRutinas");