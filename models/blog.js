const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      description: {
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
      
      
    })
   
module.exports = mongoose.model('blog', blogSchema)