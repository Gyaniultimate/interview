const mongoose = require('mongoose')






const companySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    imgurl:{
        type:String},
    
    createdAt: {
      type: Date,
      default: Date.now
    }
    
  })

  


  module.exports = mongoose.model('company', companySchema)
