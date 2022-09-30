//Required Modules and initialize variables
const express = require('express')
let nosqlRouter = express.Router()

//route for main nosql page
nosqlRouter.route('/home')
  .get((req, res) => {
    res.render('pages/nosql/nosqlhome.ejs')
  })


//route for page that appears upon successful nosql exploitation, called from view.
nosqlRouter.route('/Success')
  .get((req, res) => {
    User.findOne({ email: req.query.email, password: req.query.password }, (err, verifiedUser) => {
      if (err) {
        console.log(err);
      } else {
        if (verifiedUser) {
          console.log(verifiedUser, req.query.email, req.query.password);
          res.render('pages/nosql/noSQLSuccess.ejs', { errorMessage: 'Congrats' })
        } else {
          console.log(verifiedUser, req.query.email, req.query.password);
          res.render('pages/nosql/noSQLInjectionGET.ejs', { errorMessage: 'Authention Failed, Please try again' })
        }
      }
    })
  })


//provides route for GET method challenge
nosqlRouter.route('/InjectionGET')
  .get((req, res) => {
    res.render('pages/nosql/noSQLInjectionGET.ejs', { errorMessage: '' })
  })

//provides routes for POST method challenge
nosqlRouter.route('/InjectionPOST')

  //Displays POST method challenge view
  .get((req, res) => {
    res.render('pages/nosql/noSQLInjectionPost.ejs', { errorMessage: '' })
  })

  //provides backend funtionality for post requests on POST challenge
  .post((req, res) => {})

//exports routes to be used throughout application
module.exports = nosqlRouter
