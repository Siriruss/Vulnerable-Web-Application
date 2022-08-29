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



// Requests Targeting All Tools

app.route('/tools')

  .get((req, res) => {
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
