const express = require('express')
let router = express.Router()

router.route('/home')
  .get((req, res) => {
    res.render('pages/ssti/sstihome.ejs')
  })

module.exports = router
