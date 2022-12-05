const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    validate: {
      validator(str) {
        // eslint-disable-next-line no-useless-escape
        return str.match(/https?:\/\/[a-zA-Z0-9\/.\-]+\.+[a-zA-Z0-9\/.-]+#?/g);
      },
    },
    message: 'Ошибка валидации url изображения',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('vehicle', vehicleSchema);
