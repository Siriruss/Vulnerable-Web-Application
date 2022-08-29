const express = require('express')
let router = express.Router()

router.route('/')
  .get((req, res) => {

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

module.exports = router
