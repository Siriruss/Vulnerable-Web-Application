//Required Modules and initialize variables
const express = require('express')
let router = express.Router()

//provides route for SSTI main challenge page
router.route('/home')
  .get((req, res) => {
    res.render('pages/ssti/sstihome.ejs')
  })

//exports routes to be used throughout application
module.exports = router
