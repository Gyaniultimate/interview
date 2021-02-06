const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email field cannot be empty'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Not a valid email ;please enter a valid one.']
  },
  password: {
    type: String,
    required: [true, 'Password field cannot be empty'],
    minlength: [6, 'Password should be minimum of 6 characters'],
  },
  firstName : {
    type: String,
    required : true
  },
  lastName : {
    type : String
  }
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;