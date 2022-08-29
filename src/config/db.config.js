const mongoose = require('mongoose')

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

module.exports = defaultUsers
