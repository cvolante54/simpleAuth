const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define our Model
const userSchema = new Schema({
  //makes the email unique, no two user with the same email
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

//On save hook, encrypt password
userSchema.pre('save', function(next){
  //get access to user model
  const user = this;

  //generate a salt
  bcrypt.genSalt(10, function(err, salt){
    if(err){ return next(err); }

    //hash(encrypt) the passsword using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){ return next(err); }

      //overwrite password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){return callback(err);}

    callback(null, isMatch);
  });
}

//Create a model class
const User = mongoose.model('user', userSchema);

//export
module.exports = User;
