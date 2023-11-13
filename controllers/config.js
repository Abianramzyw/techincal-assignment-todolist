const LocalStrategy = require('passport-local').Strategy;
const { getHashedPassword } = require('./function')
const { User } = require('../mongodb/model');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            let hashed = getHashedPassword(password)
            User.findOne({email: email}).then(users => {
                if (!users) return done(null, false, {
                        message: 'Email tidak ditemukan',
                    })
                if (email === users.email && hashed === users.password) {
                    return done(null, users);
                } else {
                    return done(null, false, {
                        message: 'Email atau Password salah',
                    })
                }
            })
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}