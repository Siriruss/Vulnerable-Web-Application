const express = require('express')
let xssRouter = express.Router()

xssRouter.route('/home')
  .get((req, res) => {
    res.render('pages/xss/xsshome.ejs')
  })

xssRouter.route('/challengeDOM')
  .get((req, res) => {
    let lang = req.query.language
    res.render('pages/xss/xsschallengeDOM.ejs', { language: lang || 'english' })
  })

xssRouter.route('/challengeejs')
  .get((req, res) => {
    let searchRequest = req.query.searchValue;

    res.render('pages/xss/xsschallengedup.ejs', { searchReq: searchRequest })
  })

xssRouter.route('/challengejquery')
  .get((req, res) => {
    res.render('pages/xss/xsschallenge.ejs', { searchResults: '' })
  })

  .post((req, res) => {
    res.set('Content-Security-Policy', "script-src * 'unsafe-inline'")
    let userInput = req.body.searchValue
    console.log(userInput);
    res.send(userInput)
  })

xssRouter.route('/challengenoscript')
  .get((req, res) => {
    res.render('pages/xss/xsschallengenoscript.ejs', { searchReqNS: '' })
  })

  .post((req, res) => {
    let searchRequestNS = req.body.searchValue;
    let notValid = req.body.searchValue.toLowerCase().includes('script')

    if (notValid == true) {
      res.render('pages/xss/xsschallengenoscript.ejs', { searchReqNS: 'Nice try, but scripts are not allowed here!' })
    } else {
      res.render('pages/xss/xsschallengenoscript.ejs', { searchReqNS: searchRequestNS })
    }
  })

xssRouter.route('/challengetwoinputs')
  .get((req, res) => {
    res.render('pages/xss/xsschallengetwoinputs.ejs', { fullNameOutput: '' })
  })

  .post((req, res) => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let fullName = (firstName + ' ' + lastName)

    if (firstName.length > 8 || lastName.length > 70) {
      res.render('pages/xss/xsschallengetwoinputs.ejs', { fullNameOutput: 'Seems like you may be doing something suspicious with a name that long. Please try again.' })
    } else {
      if (lastName.toLowerCase().includes('<script>')) {
        res.render('pages/xss/xsschallengetwoinputs.ejs', { fullNameOutput: 'Starting scripts here is not allowed. Please try again.' })
      } else {
        res.render('pages/xss/xsschallengetwoinputs.ejs', { fullNameOutput: fullName })
      }
    }
  })

module.exports = xssRouter
