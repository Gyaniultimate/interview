const mongoose = require('mongoose')


const Topic = require("../models/topics");



const questionSchema = new mongoose.Schema({
    topic :{
    type : mongoose.Schema.Types.ObjectId, 
    ref : 'Topic',
    required : true
    },
    title: {
      type: String,
      required: true
    },
    url: {
        type: String,
        required: true
    },

    linkTo : {

        type: String,
        required: true
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    },
    approved : {
      type : Boolean,
      default : false 
  }
    
    
  })

 


  module.exports = mongoose.model('Question', questionSchema)
