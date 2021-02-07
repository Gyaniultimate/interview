const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { reqAdminAuth } = require('./middleware/authAdmin');

const authController = require('./controllers/authController');

const authRoutes = require('./routes/authRoutes');

const express = require('express')
const mongoose = require('mongoose')



const methodOverride = require('method-override')
const questions = require('./models/questions')
const comp = require('./models/companies')
const exp = require('./models/blog')


const top= require('./models/topics')
const topicquesRouter=require('./routes/topques')
const experienceRouter=require('./routes/experience')
const app = express()

 // middleware
 app.use(express.static('public'));
 app.use(express.json());
 app.use(cookieParser());

 //view engine 
 app.set('view engine', 'ejs')


//db connection
const PORT = process.env.PORT || 4040
mongoose.connect('mongodb://localhost/interview', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/interview'

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


 //routes

 app.get('*',checkUser);

 app.get('/admin');


app.get('/', async (req, res) => {
  const topics = await top.find().sort({ createdAt: 'desc' })
  res.render('topques/index', { topics: topics })
})

app.get('/exp', async (req, res) => {
  const companies = await comp.find().sort({ createdAt: 'desc' })
  res.render('experience/index', { companies : companies })
})
app.get('/form',  authController.form_get);
app.post('/form',authController.form_post);
app.get('/form_blog',  authController.form_blog_get);
app.post('/form_blog',authController.form_blog_post);


  app.use('/topques', topicquesRouter)
  app.use('/experience', experienceRouter)

//admin bro

AdminBro.registerAdapter(AdminBroMongoose)
  const AdminBroOptions = {
    databases: [mongoose]
  }
  const adminBro = new AdminBro(AdminBroOptions)
  const router = AdminBroExpress.buildRouter(adminBro)
  app.use(adminBro.options.rootPath, router)
  
  

  app.use(authRoutes);




  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
  })


