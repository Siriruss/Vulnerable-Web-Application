//Includes secrets file for sessions
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//Required Modules and initialize variables
const session = require('express-session')
const passport = require('passport');
const http = require('http')
const https = require('https')
const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose')
const path = require('path');
const ejs = require('ejs');
const argon2 = require('argon2');
const User = require('./src/models/User.js')
const app = express();

//allows access to static files
app.use(express.static('./src/public'));

//Allows application to parse data from post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sets application to use ejs as view engine
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs');

//Initializes and passes vairables for passport associated with email and id
const initializePassport = require('./src/config/passport-config');
initializePassport(passport,
  email => User.findOne({ email: req.body.email }),
  id => User.findOne({ email: req.body.email }, '_id')
);

//creates options that are used during session creation
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

//initializes passport and sessions
app.use(passport.initialize())
app.use(passport.session())

//connects to mongoDB database
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/UserDB');
}

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

require('./src/config/routes')(app);

//sets the port for the server to run on
app.listen(3000, () => {
  console.log('Server started on port 3000');
})
