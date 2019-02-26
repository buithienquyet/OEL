var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const User = require('../databases/mongodb/models/User');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        User.findOne({ userName: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user.isValidPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
        done(err, user);
    });
});