const User = require("../models/User");
const jwt = require('jsonwebtoken');
//const Question = require('../models/questions');
const Quest = require('../models/questions');
//const Topics = require('../models/topics');
const Topic = require("../models/topics");
const Company = require("../models/companies");
const Blog = require("../models/blog");
const { Query } = require("mongoose");
const { isAdmin } = require('../middleware/authAdmin');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'a secret token', {
    expiresIn: maxAge
  });
};

// controller actions

// get

//signup get
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

//login get
module.exports.login_get = (req, res) => {
  res.render('login');
}

//form get
module.exports.form_get = async (req, res) => {
  const filter = {};
  const all_topics = await Topic.find(filter);
  res.render('forms', {topics : all_topics});
}

//form_blog get
module.exports.form_blog_get = async (req, res) => {
  const filter = {};
  const all_companies = await Company.find(filter);
  res.render('forms_blog', {companies : all_companies});
}


//post

//signup post
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

//login post
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

// form post
module.exports.form_post = async (req, res) => {
  const {topic,title,url, linkTo,createdAt} = req.body;
  const approved = isAdmin( req, res );
  var topicid;
  await Topic.find({title : topic}).then((result) => topicid = result[0]._id);
  console.log("title : ", title, topic, url,linkTo , createdAt, approved);
  try {
    const quest = await Quest.create({topic : topicid, title, url,linkTo : topic,createdAt, approved});
    res.status(201).json({quest : quest._id});
  }
  catch(err) {
    console.log(err);
    res.status(401).json({err});
  }
}

// form_blog post
module.exports.form_blog_post = async (req, res) => {
  const {company,title,url,image, author,linkToCompany,createdAt } = req.body;
  const approved = isAdmin( req, res );
  var companyid;
  await Company.find({title : company}).then((result) => companyid = result[0]._id);
  console.log("title : ", title,image, company, url,author,linkToCompany, approved);
  try {
    const blogss = await Blog.create({company : companyid,image, title, url,author,linkToCompany : company,createdAt, approved});
    res.status(201).json({company : company._id});
  }
  catch(err) {
    console.log(err);
    res.status(401).json({err});
  }
}




//logout get
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
}