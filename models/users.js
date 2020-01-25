const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    min: 5
  },
  password: {
    type: String,
    required: true,
    min: 6
  }
})

module.exports = mongoose.model('User', userSchema)