const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const Tool = require('./models/Tool.js')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')

app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/ToolDB', { useNewUrlParser: true })

const tool1 = new Tool({
  name: 'CredKing',
  description: 'Password sprays against websites like Google’s GSuite are getting more and more difficult. CredKing looks to solve that problem by leveraging Amazon AWS Lambda to rotate IP addresses for each authentication attempt. Fully supporting all AWS Lambda regions, CredKing is a must-have tool for cracking external perimeters through password spraying!'
})

const tool2 = new Tool({
  name: 'CredDefense',
  description: 'Wouldn’t it be great if there was a free toolset to protect your credentials even when password length couldn’t be changed, and to alert on other credential attacks being conducted in your network? That’s why we created The CredDefense Toolkit – to have a free way to detect and prevent credential abuse attacks. Read more on this tool in this blog post.'
})

const tool3 = new Tool({
  name: 'Auto Scan with Burp',
  description: 'Auto Scan with Burp contains a Burp Extension and a Python script for invoking the extension to perform automated and authenticated scans against all URLs listed in a configuration file. Authentication is accomplished through Burp State files. Auto Scan comes with an optional Nikto scan function as well.'
})

const defaultTools = [tool1, tool2, tool3];

// Requests Targeting All Tools

app.route('/tools')

  .get((req, res) => {
      Tool.find({}, function (err, foundUsers) {
            if (foundUsers.length === 0) {
              Tool.insertMany(defaultUsers, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Successfully logged default tools to database');
                }
              })
              res.redirect('/tools')
            } else {
              Tool.aggregate([{ $sample: { size: 1 } }], (err, foundTools) => {
                if (!err) {
                  res.send(foundTools)
                } else {
                  res.send(err)
                }
              })
            })

          .post((req, res) => {
            console.log(req.body.name);
            console.log(req.body.description);

            const newTool = new Tool({
              name: req.body.name,
              description: req.body.description
            })

            newTool.save((err) => {
              if (err) {
                console.log(err);
              } else {
                res.send('Successfully logged new tool!')
              }
            })
          })

          .delete((req, res) => {
            Tool.deleteMany((err) => {
              if (!err) {
                res.send('Successfully deleted all tools!')
              } else {
                res.send(err)
              }
            })
          })


          // Requests Targeting Specific Tools

          app.route('/tools/:randomTool')

          .get((req, res) => {
            Tool.findOne({ name: req.params.randomTool }, (err, foundTool) => {
              if (foundTool) {
                res.send(foundTool)
              } else {
                res.send("No tools were found!")
              }
            })
          })

          // .put((req,res) => {
          //
          // })

          //.patch().delete()



          app.listen(4000, function () {
            console.log('API started on port 4000');
          })
