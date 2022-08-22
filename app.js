//Includes secrets file for sessions
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//Required Modules and initialize variables
const http = require('http')
const https = require('https')
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

// --------------------Get Routes------------------------

app.get('/', (req, res) => {

  User.find({}, function (err, foundUsers) {
    if (foundUsers.length === 0) {
      User.insertMany(defaultUsers, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully logged default users to database');
        }
      })
      res.redirect('/')
    } else {
      res.render('home.ejs')
    }
  })
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
  res.render('ssrfhome.ejs')
})

app.get('/ssrfchallenge', (req, res) => {
  res.render('ssrfchallenge.ejs')
})

app.get('/ssrfchallengetwo', (req, res) => {
  res.render('ssrfchallengetwo.ejs', { newImageURL: '' })
})

app.get('/ssrfchallengethree', (req, res) => {
  res.render('ssrfchallengethree.ejs', { newImageURL: '' })
})

app.get('/sstihome', (req, res) => {
  res.render('sstihome.ejs')
})

app.get('/NOSQLhome', (req, res) => {
  res.render('NOSQLhome.ejs')
})

app.get('/xsschallenge', (req, res) => {
  res.render('xsschallenge.ejs', { searchResults: '' })
})

app.get('/xsschallengedup', (req, res) => {
  let searchRequest = req.query.searchValue;
  console.log(searchRequest);

  res.render('xsschallengedup.ejs', { searchReq: searchRequest })
})

app.get('/xsschallengenoscript', (req, res) => {
  res.render('xsschallengenoscript.ejs', { searchReqNS: '' })
})

app.get('/xsschallengeDOM', (req, res) => {
  let lang = req.query.language
  res.render('xsschallengeDOM.ejs', { language: lang || 'english' })
})

app.get('/xsschallengetwoinputs', (req, res) => {
  res.render('xsschallengetwoinputs.ejs', { fullNameOutput: '' })
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

app.get('/noSQLSuccess', (req, res) => {
  User.findOne({ email: req.query.email, password: req.query.password }, (err, verifiedUser) => {
    if (err) {
      console.log(err);
    } else {
      if (verifiedUser) {
        console.log(verifiedUser, req.query.email, req.query.password);
        res.render('noSQLSuccess.ejs', { errorMessage: 'Congrats' })
      } else {
        console.log(verifiedUser, req.query.email, req.query.password);
        res.render('noSQLInjectionGET.ejs', { errorMessage: 'Authention Failed, Please try again' })
      }
    }
  })
})

app.get('/noSQLInjectionGET', (req, res) => {
  res.render('noSQLInjectionGET.ejs', { errorMessage: '' })
})

app.get('/noSQLInjectionPOST', (req, res) => {
  res.render('noSQLInjectionPost.ejs', { errorMessage: '' })
})


// --------------------Post Routes------------------------
app.post('/ssrfchallengethree', (req, res) => {
  let url = req.body.urlValue

  https.get(url, (response) => {
    let data = ''
    response.on('data', (chunk) => {
      data += chunk
    })

    response.on('end', () => {
      console.log(data);
    })
  })

  res.render('ssrfchallengethree.ejs')
})

app.post('/ssrfchallengetwo', (req, res) => {
  let url = req.body.urlValue

  res.render('ssrfchallengetwo.ejs', { newImageURL: url })
})


app.post('/xsschallengetwoinputs', (req, res) => {
  let firstName = req.body.firstName
  let lastName = req.body.lastName
  let fullName = (firstName + ' ' + lastName)

  if (firstName.length > 8 || lastName.length > 70) {
    res.render('xsschallengetwoinputs.ejs', { fullNameOutput: 'Seems like you may be doing something suspicious with a name that long. Please try again.' })
  } else {
    if (lastName.toLowerCase().includes('<script>')) {
      res.render('xsschallengetwoinputs.ejs', { fullNameOutput: 'Starting scripts here is not allowed. Please try again.' })
    } else {
      res.render('xsschallengetwoinputs.ejs', { fullNameOutput: fullName })
    }
  }
})

app.post('/xsschallengenoscript', (req, res) => {
  let searchRequestNS = req.body.searchValue;
  let notValid = req.body.searchValue.toLowerCase().includes('script')

  if (notValid == true) {
    res.render('xsschallengenoscript.ejs', { searchReqNS: 'Nice try, but scripts are not allowed here!' })
  } else {
    res.render('xsschallengenoscript.ejs', { searchReqNS: searchRequestNS })
  }
})

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

app.post('/noSQLInjectionPOST', (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password }, (err, verifiedUser) => {
    if (err) {
      console.log(err);
    } else {
      if (verifiedUser) {
        console.log(verifiedUser, req.body.email, req.body.password);
        res.render('noSQLSuccess.ejs', { errorMessage: 'Congrats' })
      } else {
        console.log(verifiedUser, req.body.email, req.body.password);
        res.render('noSQLInjectionPOST.ejs', { errorMessage: 'Authention Failed, Please try again' })
      }
    }
  })
})

app.post('/ssrfchallenge', (req, res) => {
  let imgURL = req.body.urlValue

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

//res.set('X-XSS-Protection', '0')
//res.set('Content-Security-Policy', "script-src *")
