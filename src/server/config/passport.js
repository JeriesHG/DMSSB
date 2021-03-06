let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let Client = mongoose.model('Client');

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  function(username, password, done) {
    Client.findOne({
      username: username
    }, function(err, client) {
      if (err) {
        return done(err);
      }
      // Return if client not found in database
      if (!client) {
        return done(null, false, {
          message: 'Cuenta no encontrada! Por favor contacte al administrador del sistema.'
        });
      }
      // Return if password is wrong
      if (!client.validPassword(password)) {
        return done(null, false, {
          message: 'Contraseña invalida! Por favor intente de nuevo.'
        });
      }
      // If credentials are correct, return the client object
      return done(null, client);
    });
  }
));
