const express = require('express')
const Company = require('./../models/companies')
const Blog =  require('./../models/blog')
const routerq = express.Router()

routerq.get('/:title', async (req, res) => {
    const blog = await Blog.find({ linkToCompany: req.params.title })
    if (blog == null) res.redirect('/')
    res.render('experience/blogs', { blogs: blog })
  })

  
  

  module.exports = routerq;
