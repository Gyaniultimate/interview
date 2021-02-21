const mongoose = require('mongoose')

const Company = require("../models/companies");

const blogSchema = new mongoose.Schema({
    company :{
    type : mongoose.Schema.Types.ObjectId, 
    ref : 'Company',
    required : true
    },
    
    title: {
        type: String,
        required: true
      },
      image: {
        type:String
      },
      url: {
          type: String,
          required: true
      },
      author : {
  
        type: String,
        required: true
    },
  
      linkToCompany : {
  
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
   
module.exports = mongoose.model('blog', blogSchema)