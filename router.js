const Authentication = require('./controllers/authentication.js');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app){

  app.get('/', requireAuth, function(req, res){
    console.log("Hello");
    res.send({message: "secret code is SECRET"});
  });

  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup);
}
