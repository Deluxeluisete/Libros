import * as mongoose from 'mongoose';
//definimos el esquema de ediciones y juegos
const today = new Date();
const year = today.getFullYear();
export const edicionSchema = new mongoose.Schema({
  edicion: {
    type: String,
    required: true,
  },
  anyo: {
    type: Number,
    required: true,
    min: 2000,
    max: year,
  },
});
export const JuegoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 1,
    max: 99,
  },
  jugadores: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
    enum: ['rol', 'escape', 'dados', 'fichas', 'cartas', 'tablero'],
  },
  precio: {
    type: Number,
    required: true,
    min: 1,
  },

  imagen: {
    type: String,
    trim: true,
    required: false,
  },
  Ediciones: [edicionSchema],
});
