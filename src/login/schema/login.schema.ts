import * as mongoose from 'mongoose';

export const LoginSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});
