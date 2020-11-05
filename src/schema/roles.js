const mongoose = require('mongoose')

// schema for roles
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 255,
    required: true,
    unique: true
  }
})

const Role = mongoose.model('Role', roleSchema)

module.exports = { Role }
