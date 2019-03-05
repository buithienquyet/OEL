var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const User = require('../databases/mongodb/models/User');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        User.findOne({ userName: username }, function(err, user) {
            if (err || !user) {
                return done(err);
            } else if (!user.isValidPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    // User.findById(_id, function(err, user) {
    //     done(err, user);
    // });
    done(null, user);
});