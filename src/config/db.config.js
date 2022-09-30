//Required Modules and initialize variables
const mongoose = require('mongoose')

//Initial users that will be placed in database on startup
const user1 = new User({
  email: 'todd.gill@gmail.com',
  password: 'Batman123!'
})

const user2 = new User({
  email: 'emma.daniels@gmail.com',
  password: 'ChicagoSKY12#$'
})

const user3 = new User({
  email: 'admin',
  password: 'Christmas1995'
})

const defaultUsers = [user1, user2, user3];

//exports users to be used throughout application
module.exports = defaultUsers
