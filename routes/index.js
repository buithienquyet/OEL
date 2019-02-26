var express = require('express');
var router = express.Router();
var passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../databases/mongodb/models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login.html'
    }));

router.post('/register', async function(req, res) {
    try {
        let salt = bcrypt.genSaltSync(10);
        let user = new User();
        let body = req.body;
        user.userName = body.username;
        user.password = bcrypt.hashSync(body.password, salt);
        user.firstName = body.firstname;
        user.lastName = body.lastname;
        user.email = body.email;
        user.address = body.address;
        user.createdDate = new Date();

        await user.save();
        res.redirect('/login.html');
    } catch (e) {
        console.log(e);
        res.send('Error!');
    }
});

router.get('/logout', function(req, res) {
    if (req.isAuthenticated) {
        req.logout();
        res.redirect('/');
    }
})

module.exports = router;