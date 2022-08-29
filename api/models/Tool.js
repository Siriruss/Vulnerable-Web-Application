const mongoose = require('mongoose')

const toolSchema = {
  name: String,
  description: String
}

module.exports = Tool = mongoose.model('Tool', toolSchema)
