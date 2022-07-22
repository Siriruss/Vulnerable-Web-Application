//Required Modules and initialize variables
const mongoose = require('mongoose')

//Creation on schema(shape of doucuments within database collection)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

//exposes User model to the rest of the application
module.exports = User = mongoose.model('user', userSchema)
