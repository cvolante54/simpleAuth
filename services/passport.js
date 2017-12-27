const passport = require('passport');
const User = require('../Models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');

//create local startegy
const localOptions = { usernameField: 'email'};
const localLogin = new localStrategy(localOptions, function(email, password, done){
  //verify this username and password
  User.findOne({email: email}, function(err, user){
    if(err){ return done(err);}
    if(!user){ return done(null, false);}

    //compare password
    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err);}
      if(!isMatch){ return done(null, false);}

      done(null, user);
    });
  })
  //if it is the correct email & password

  //otherwise, call done  with false
});

//set options for jwt strategy
const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create JWT Strategy
const jwtLogin = new JwtStrategy(JwtOptions, function(payload, done){
  //See if the user id in payload exist in DB
  //if it does call done with that order
  //if it doesn't, call done without user object
  console.log("IN here");
  User.findById(payload.sub, function(err, user){
    if(err){ return done(err, false);}

    if(user){
      done(null, user);
    }else{
      done(null, false);
    }
  });
});

//tell pasport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
