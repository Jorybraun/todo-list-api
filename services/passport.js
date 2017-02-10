const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' }

// set up options for JWT strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this username and password
  // call done if its the right username and password
  // other wise call done with false
  User.findOne({ email: email }, function(err, user){
    if(err) {return done(err)}
    // if no user retrun early
    if(!user) {return done(null, false, {'message': 'no user found'})}
    // if user - compare passwords 
    user.comparePassword(password, function(err, isMatch){
      if(err) {return done(err)}
      if(!isMatch) {return done(null, false)}
        
      return done(null, user);
    });
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// create the jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // see if the user id in the payload exists in out database
  // if it does, call done that other
  // otherwise, call done without a user object which denies entry.
  User.findById(payload.sub, function(err, user){
    if(err) { return done(err, false); }

    if(user){
      done(null, user);
    }else{
      done(null, false);
    }

  });
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);