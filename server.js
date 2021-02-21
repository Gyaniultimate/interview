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
let dirname = require("./dirname");


const methodOverride = require('method-override')
const questions = require('./models/questions')
const comp = require('./models/companies')
const exp = require('./models/blog')


const top= require('./models/topics')
const topicquesRouter=require('./routes/topques')
const experienceRouter=require('./routes/experience')
const app = express()

 // middleware
 app.use('/assets',express.static('assets'));
 app.use(express.static(__dirname +'./assets/'));

 //app.use(express.static('public'));
 app.use(express.json());
 app.use(cookieParser());

 //view engine 
 app.set('view engine', 'ejs')

 //multer
 const multer = require('multer');
//const upload = multer({dest : 'public/uploads/'});

const storage = multer.diskStorage({
 
 destination: (req, file, cb) => {
    let dir = dirname.dirpath + "/assets/";
    cb(null, dir);
 },
  
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  }).single("image");


const multerMiddleware = (req, res, next)=>{
 upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return next(err);
    } else {
      console.log(req.file);
      if (req.file) {
        console.log("thumbnail is uploaded successfully");
        return next();
      } else {
        console.log("something went wrong when uploading the file");
        return next();
      }
    }
  });


}




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

 app.get('/admin',reqAdminAuth);

 app.get('/',requireAuth, async (req, res) => {
  
  res.render('home.ejs')
})

app.get('/top//',requireAuth, async (req, res) => {
  const topics = await top.find().sort({ createdAt: 'desc' })
  res.render('topques/index', { topics: topics })
})

app.get('/exp//',requireAuth, async (req, res) => {
  const companies = await comp.find().sort({ createdAt: 'desc' })
  res.render('experience/index', { companies : companies })
})

app.get('/form', requireAuth, authController.form_get);
app.post('/form', requireAuth, authController.form_post);
app.get('/form_blog',requireAuth,  authController.form_blog_get);
app.post('/form_blog',requireAuth,multerMiddleware, authController.form_blog_post);


  app.use('/top/topques', topicquesRouter)
  app.use('/exp/experience', experienceRouter)

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


