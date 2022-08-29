const express = require('express')
const http = require('http')
const https = require('https')
let router = express.Router()

router.route('/home')
  .get((req, res) => {
    res.render('pages/ssrf/ssrfhome.ejs')
  })

router.route('/challenge')
  .get((req, res) => {
    res.render('pages/ssrf/ssrfchallenge.ejs')
  })

router.route('/challengefour')
  .get((req, res) => {
    res.render('pages/ssrf/ssrfchallengefour.ejs', { foundToolName: '', foundToolDescription: '' })
  })

  .post((req, res) => {
    let randomTool = req.body.getTool

    let foundTool = http.get(randomTool, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })

      response.on('end', () => {
        let parsedTool = JSON.parse(data)
        let selectedTool = parsedTool[0]
        res.render('pages/ssrf/ssrfchallengefour.ejs', { foundToolName: selectedTool.name, foundToolDescription: selectedTool.description })
      })
    })
  })

module.exports = router
