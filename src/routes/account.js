//Required Modules and initialize variables
const session = require('express-session')
const passport = require('passport');
const express = require('express')
const mongoose = require('mongoose')
const argon2 = require('argon2');
let router = express.Router()

//Provieds route to admin page
router.route('/admin')
  .get(checkAuthenticated, (req, res) => {
    res.render('pages/account/admin.ejs')
  })

//provides route to login page
router.route('/login')
  .get(checkNotAuthenticated, (req, res) => {
    res.render('pages/account/login.ejs', { errorMessage: '', usedEmail: '' })
  })

  //during login, calls passport middleware to authenticate user and create session
  .post(checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))


router.route('/logout')
  //logsout the user and deauthenticates them from the session
  .get(checkAuthenticated, (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  })

router.route('/register')
  .get(checkNotAuthenticated, (req, res) => {
    res.render('pages/account/register.ejs', { errorMessage: '' })
  })

  //creates and saves user object if valid during registration
  .post(checkNotAuthenticated, (req, res) => {
    User.findOne({ email: req.body.email }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) { //determines if a user with requested email already exists
          res.render("pages/account/register", {
            errorMessage: 'An account associated with this email already exists. Please try again.'
          })
        } else {
          if (req.body.password != req.body.verifiedPassword) { //verifies passwords match before creating account
            res.render("pages/account/register", {
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
                  res.redirect('/account/register', {
                    errorMessage: 'Seems like there was an error on our end. Please try again.'
                  });
                } else {
                  res.render('pages/account/successfulRegistration');
                }
              })
            })
          }
        }
      }
    })
  })

//provides route to account page and prevents using back arrow to return after logout
router.route('/account')
  .get(checkAuthenticated, (req, res) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.render('pages/account/account.ejs', { userInput: '' })
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

//exports routes to be used in rest of application
module.exports = router, checkAuthenticated, checkNotAuthenticated;
