const express = require('express')
const Question = require('./../models/questions')
const Topic =  require('./../models/topics')
const router = express.Router()

router.get('/:title', async (req, res) => {
    const questions = await Question.find({ linkTo: req.params.title })
    if (questions == null) res.redirect('/')
    res.render('topques/questions', { questions: questions })
  })

  

  module.exports = router;

