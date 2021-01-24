const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

const express = require('express')
const mongoose = require('mongoose')



const methodOverride = require('method-override')
const questions = require('./models/questions')

const top= require('./models/topics')
const topicquesRouter=require('./routes/topques')
const app = express()

const PORT = process.env.PORT || 4040
mongoose.connect('mongodb://localhost/interview', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/interview'
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
  const topics = await top.find().sort({ createdAt: 'desc' })
  res.render('topques/index', { topics: topics })
})

  app.use('/topques', topicquesRouter)
//admin bro

AdminBro.registerAdapter(AdminBroMongoose)
  const AdminBroOptions = {
    resources: [top,questions],
  }
  const adminBro = new AdminBro(AdminBroOptions)
  const router = AdminBroExpress.buildRouter(adminBro)
  app.use(adminBro.options.rootPath, router)
  
  


  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
  })


