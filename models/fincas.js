const mongoose = require('mongoose')

const fincaSchema = new mongoose.Schema({
  rating: Number,
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  images: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  swimmingPool: Boolean,
  sauna: Boolean,
  footballField: Boolean,
  kiosk: Boolean,
  greenZones: Boolean,
  bbq: Boolean,
  childrenGames: Boolean,
  parking: Boolean,
  billiards: Boolean,
  beds: {
    type: Number,
    required: true
  },
  rooms: {
    type: Number,
    required: true
  },
  baths: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Finca', fincaSchema)