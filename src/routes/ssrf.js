//Required Modules and initialize variables
const express = require('express')
const http = require('http')
const https = require('https')
const multer = require('multer')
const path = require('path');
const fs = require('fs')
const url = require('url')
let router = express.Router()

//provides route for server side request forgery challenges home page
router.route('/home')
  .get((req, res) => {
    res.render('pages/ssrf/ssrfhome.ejs')
  })

//provides route for image download SSRF challenge
router.route('/challenge')
  .get((req, res) => {
    res.render('pages/ssrf/ssrfchallenge.ejs')
  })

  //Downloads a file from a URL that the user inputs to the downloads folder on the server. The downloaded file is then displayed back to the user.
  .post((req, res) => {
    let fileURL = req.body.urlValue
    let filename = path.basename(fileURL)
    let urlProtocol = url.parse(fileURL).protocol

    var adapterFor = (function () {
      var url = require('url'),
        adapters = {
          'http:': require('http'),
          'https:': require('https'),
        };

      return function (inputUrl) {
        return adapters[url.parse(inputUrl).protocol]
      }
    }());

    const downloadReq = adapterFor(fileURL).get(fileURL, function (res) {
      const fileStream = fs.createWriteStream('./src/public/Downloads/' + filename)
      res.pipe(fileStream)

      fileStream.on('error', function (err) {
        console.log("Error writing to file stream.");
        console.log(err);
      })

      fileStream.on('finish', function () {
        fileStream.close()
        console.log('Done!');
      })
    })

    downloadReq.on('error', function (err) {
      console.log("Error downloading file.");
      console.log(err);
    })

    res.render('pages/ssrf/ssrfchallenge.ejs', {
      file: ('/Downloads/' + filename)
    })
  })

//provides a route for the file upload SSRF challenge
router.route('/challengetwo')

  .get((req, res) => {
    res.render('pages/ssrf/ssrfchallengetwo.ejs')
  })

  //Uploads a file provided by the user to the uploads folder on the server. The uploaded file is then displayed back to the user.
  .post((req, res) => {
    let storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './src/public/Uploads')
      },
      filename: function (req, file, callback) {
        let temp_file_arr = file.originalname.split('.')
        let temp_file_name = temp_file_arr[0]
        let temp_file_extension = temp_file_arr[1]

        callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension)
      }
    })

    let upload = multer({ storage: storage }).single('sampleFile')

    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.end('Error Uploading File')
      } else {
        res.render('pages/ssrf/ssrfchallengetwo.ejs', {
          file: `/Uploads/${req.file.filename}`
        })
      }
    })
  })

//provides route for API calling SSRF challenge
router.route('/challengefour')
  .get((req, res) => {
    res.render('pages/ssrf/ssrfchallengefour.ejs', { foundToolName: '', foundToolDescription: '' })
  })

  //calls API and returns a random tool ensuring the call is generated from the server.
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

//exports routes to be used throughout application
module.exports = router
