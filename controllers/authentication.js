const User = require('../Models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next){
  //User had already email and password auth's
  //We need to give them a token
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error: 'You must provide email and password'});
  }

  //see if user with a given email exists
  User.findOne({ email: email}, function(err, existingUser){
    if(err){ return next(err);}

    //if user does exist, return an error
    if(existingUser){
      return res.status(422).send({error: 'An user already exists with this email'});
    }
    //if user does not exist, create and dave user record
    const user = new User({
      email: email,
      password: password,
    });

    user.save(function(err){
      if(err){ return next(err);}

      //respond to request indicating the user was created
      res.json({token: tokenForUser(user)});
    });

  });
}
