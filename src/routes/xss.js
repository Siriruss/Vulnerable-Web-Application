//Required Modules and initialize variables
const express = require('express')
let xssRouter = express.Router()

//provides route for xss challenge home page
xssRouter.route('/home')
  .get((req, res) => {
    res.render('pages/xss/xsshome.ejs')
  })

//provides route for document object model xss challenge
xssRouter.route('/challengeDOM')
  .get((req, res) => {
    let lang = req.query.language
    res.render('pages/xss/xsschallengeDOM.ejs', { language: lang || 'english' })
  })

//provides route for xss challenge that utilizes ejs
xssRouter.route('/challengeejs')
  .get((req, res) => {
    let searchRequest = req.query.searchValue;

    res.render('pages/xss/xsschallengedup.ejs', { searchReq: searchRequest })
  })

//provides route for xss challenge that utilizes jquery
xssRouter.route('/challengejquery')
  .get((req, res) => {
    res.render('pages/xss/xsschallenge.ejs', { searchResults: '' })
  })

  //Server side processing for challenge with res.set allowing for unsafe user input
  .post((req, res) => {
    res.set('Content-Security-Policy', "script-src * 'unsafe-inline'")
    let userInput = req.body.searchValue
    console.log(userInput);
    res.send(userInput)
  })

//provides route for xss challenge that does not allow the user to use a script tag
xssRouter.route('/challengenoscript')
  .get((req, res) => {
    res.render('pages/xss/xsschallengenoscript.ejs', { searchReqNS: '' })
  })

  .post((req, res) => {
    //parses user input for the word script
    let searchRequestNS = req.body.searchValue;
    let notValid = req.body.searchValue.toLowerCase().includes('script')

    //checks for script tag and returns response based on if it is included or not
    if (notValid == true) {
      res.render('pages/xss/xsschallengenoscript.ejs', { searchReqNS: 'Nice try, but scripts are not allowed here!' })
    } else {
      res.render('pages/xss/xsschallengenoscript.ejs', { searchReqNS: searchRequestNS })
    }
  })

//provides route for xss challenge that requires the user to input the script into two different fields
xssRouter.route('/challengetwoinputs')
  .get((req, res) => {
    res.render('pages/xss/xsschallengetwoinputs.ejs', { fullNameOutput: '' })
  })

  .post((req, res) => {
    //sets user input to variables and combines them into one variable
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let fullName = (firstName + ' ' + lastName)

    //Verifies the user input length is correct and not being manipulated view inspect view or other applications
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

//exports routes to be used throughout application
module.exports = xssRouter
