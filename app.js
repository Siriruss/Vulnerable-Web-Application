//Includes secrets file for sessions
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//Required Modules and initialize variables
const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose')
const path = require('path');
const ejs = require('ejs');
const argon2 = require('argon2');
const session = require('express-session')
const passport = require('passport');
const User = require('./models/User.js')
const app = express();

//Initializes and passes vairables for passport associated with email and id
const initializePassport = require('./passport-config');
initializePassport(passport,
  email => User.findOne({ email: req.body.email }),
  id => User.findOne({ email: req.body.email }, '_id')
);

//allows access to static files
app.use(express.static('public'));

//Allows application to parse data from post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sets application to use ejs as view engine
app.set('view engine', 'ejs');

//creates options that are used during session creation
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

//initializes passport and sessions
app.use(passport.initialize())
app.use(passport.session())

//creates global user variable that allows for determining authentication throughout application
app.use((req, res, next) => {
  res.locals.user = req.user;
  next()
})

//connects to mongoDB database
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://admin-noah:dHFXK7gVTNhi5RA@vulnerable-web-app.fli3j.mongodb.net/UserDB?retryWrites=true&w=majority');
}

// --------------------Get Routes------------------------

app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs', { errorMessage: '', usedEmail: '' })
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs', { errorMessage: '' })
})

app.get('/xsshome', (req, res) => {
  res.render('xsshome.ejs')
})

app.get('/ssrfhome', (req, res) => {
  res.render('ssrfchallenge.ejs')
})

app.get('/sstihome', (req, res) => {
  res.render('sstihome.ejs')
})

app.get('/xsschallenge', (req, res) => {
  //res.set('X-XSS-Protection', '0')
  //res.set('Content-Security-Policy', "script-src *")
  res.render('xsschallenge.ejs', { searchResults: '' })
  // console.log(res.headersSent)
  // console.log(JSON.stringify(req.headers))
})

app.get('/account', checkAuthenticated, (req, res) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('account.ejs', { userInput: '' })
})

//logsout the user and deauthenticates them from the session
app.get('/logout', checkAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

// --------------------Post Routes------------------------

//creates and saves user object if valid during registration
app.post('/register', checkNotAuthenticated, (req, res) => {
  User.findOne({ email: req.body.email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) { //determines if a user with requested email already exists
        res.render("register", {
          errorMessage: 'An account associated with this email already exists. Please try again.'
        })
      } else {
        if (req.body.password != req.body.verifiedPassword) { //verifies passwords match before creating account
          res.render("register", {
            errorMessage: 'Passwords do not match. Please try again.'
          })
        } else { //hashes the password with argon2 and creates new user object
          argon2.hash(req.body.password, { type: argon2.argon2id, memoryCost: 13312 }).then(password => {
            const newUser = new User({
              email: req.body.email,
              password: password
            })

            newUser.save((err) => { //saves new user object to database with hashed password
              if (err) {
                res.redirect('register');
                console.log(err);
              } else {
                res.redirect('/login');
              }
            })
          })
        }
      }
    }
  })
})

//during login, calls passport middleware to authenticate user and create session
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.post('/xsschallenge', (req, res) => {
  //res.set('X-XSS-Protection', '0')
  res.set('Content-Security-Policy', "script-src * 'unsafe-inline'")
  let userInput = req.body.searchValue
  console.log(userInput);
  res.send(userInput)
})

//prevents user from accessing routes that require authentication
function checkAuthenticated(req, res, next) { //
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

//prevents users from accessing unneeded routes while already authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

//sets the port for the server to run on
app.listen(3000, () => {
  console.log('Server started on port 3000');
})
