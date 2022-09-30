//Required Modules and initialize variables
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const Tool = require('./models/Tool.js')
const app = express()

//Allows application to parse data from post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Sets application to use ejs as view engine
app.set('view engine', 'ejs')

//allows access to static files
app.use(express.static('public'))

//connects to mongoDB database
mongoose.connect('mongodb://localhost:27017/ToolDB', { useNewUrlParser: true })

//Initializes these tools into the database on initial startup
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

  //Returns a random tool from the database and logs tools on initial get request
  .get((req, res) => {
    Tool.find({}, function (err, foundTools) {
      if (foundTools.length === 0) {
        Tool.insertMany(defaultTools, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully logged default tools to database');
            Tool.aggregate([{ $sample: { size: 1 } }], (err, foundTools) => {
              if (!err) {
                res.send(foundTools)
              } else {
                res.send(err)
              }
            })
          }
        })
      } else {
        Tool.aggregate([{ $sample: { size: 1 } }], (err, foundTools) => {
          if (!err) {
            res.send(foundTools)
          } else {
            res.send(err)
          }
        })
      }
    })
  })

  //Can be used to create or add new tools
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

  //used to delete tools from the database
  .delete((req, res) => {
    Tool.deleteMany((err) => {
      if (!err) {
        res.send('Successfully deleted all tools!')
      } else {
        res.send(err)
      }
    })
  })


// Requests Targeting Specific Tools, All methods will only effect a singular tool. Use res.sends for descriptions
app.route('/tools/:toolName')

  .get((req, res) => {
    Tool.findOne({ name: req.params.toolName }, (err, foundTool) => {
      if (foundTool) {
        res.send(foundTool)
      } else {
        res.send("No tools were found.")
      }
    })
  })

  .put((req, res) => {
    Tool.replaceOne({ name: req.params.toolName }, { name: req.body.name, description: req.body.description }, { overwrite: true }, (err) => {
      if (!err) {
        res.send("Successfully updated article.")
      } else {
        res.send("Tool not found.")
      }
    })
  })

  .patch((req, res) => {
    Tool.updateOne({ name: req.params.toolName }, { $set: req.body }, (err) => {
      if (!err) {
        res.send("Successfully patched tool description.");
      } else {
        res.send("Tool not found.")
      }
    })
  })

  .delete((req, res) => {
    Tool.deleteOne({ name: req.params.toolName }, (err) => {
      if (!err) {
        res.send("Successfully deleted tool.")
      } else {
        res.send("Tool not found.")
      }
    })
  })

//initializes API on port 4000
app.listen(4000, function () {
  console.log('API started on port 4000');
})
