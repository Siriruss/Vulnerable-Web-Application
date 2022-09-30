//Required Modules and initialize variables
const express = require('express')
let router = express.Router()
const defaultUsers = require('../config/db.config.js')

//provieds route to home page of application
router.route('/')
  .get((req, res) => {

    //Checks database to see if default users are already stored, if not it adds them
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
        res.render('index.ejs')
      }
    })
  })

//exports routes to be used throughout application
module.exports = router
