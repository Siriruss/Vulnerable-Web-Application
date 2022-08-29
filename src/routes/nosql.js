const express = require('express')
let nosqlRouter = express.Router()

nosqlRouter.route('/home')
  .get((req, res) => {
    res.render('pages/nosql/nosqlhome.ejs')
  })

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

nosqlRouter.route('/InjectionGET')
  .get((req, res) => {
    res.render('pages/nosql/noSQLInjectionGET.ejs', { errorMessage: '' })
  })

nosqlRouter.route('/InjectionPOST')
  .get((req, res) => {
    res.render('pages/nosql/noSQLInjectionPost.ejs', { errorMessage: '' })
  })

  .post((req, res) => {
    User.findOne({ email: req.body.email, password: req.body.password }, (err, verifiedUser) => {
      if (err) {
        console.log(err);
      } else {
        if (verifiedUser) {
          console.log(verifiedUser, req.body.email, req.body.password);
          res.render('pages/nosql/noSQLSuccess.ejs', { errorMessage: 'Congrats' })
        } else {
          console.log(verifiedUser, req.body.email, req.body.password);
          res.render('pages/nosql/noSQLInjectionPOST.ejs', { errorMessage: 'Authention Failed, Please try again' })
        }
      }
    })
  })

module.exports = nosqlRouter
