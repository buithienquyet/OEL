var express = require('express');
var router = express.Router();
var passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../databases/mongodb/models/User');
const Class = require('../databases/mongodb/models/Class');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v1');
const constants = require('../utils/constants');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 50000000 } });

/* GET home page. */
router.get('/', async function (req, res, next) {

    let result = await Class.find({ type: constants.CLASS.TYPE.PUBLIC }).limit(5);

    res.render('index', { user: req.user, classes: result });
});

router.get('/profile', async function (req, res, next) {
    if (req.isUnauthenticated()) {
        res.redirect('/');
    }
    else {
        res.render('profile', { user: req.user });
    }
});

router.post('/profile', upload.single('avatar'), async function (req, res, next) {
    if (req.isUnauthenticated()) {
        res.redirect('/');
    }
    else {
        try {
            const user = await User.findById(req.user._id);
            const body = req.body;

            user.firstName = body.firstName;
            user.lastName = body.lastName;
            user.address = body.address;
            user.email = body.email;
            user.phoneNumber = body.phoneNumber;

            if (req.file) {
                user.avatarUrl = req.file.filename;
            }

            if (body.password && body.password != '') {
                if (body.password != body.retypepassword) {
                    res.send({
                        status: 500,
                        msg: 'Bạn chưa xác nhận mật khẩu'
                    });
                }
                else {
                    const salt = bcrypt.genSaltSync(10);
                    user.password = bcrypt.hashSync(body.password, salt);
                }
            }

            await user.save();

            res.json({
                status: 200
            });
        }
        catch (e) {
            console.log(e);
            res.json({
                status: 500,
                msg: 'Có lỗi trong quá trình thực hiện thao tác của bạn'
            });
        }
    }
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login.html'
    }));

router.post('/register', async function (req, res) {
    try {
        let salt = bcrypt.genSaltSync(10);
        let user = new User();
        let body = req.body;
        user.userName = body.username;
        user.password = bcrypt.hashSync(body.password, salt);
        user.firstName = body.firstname;
        user.lastName = body.lastname;
        user.email = body.email;
        user.phoneNumber = body.phoneNumber;
        user.avatarUrl = "default.png";
        user.address = body.address;
        user.createdDate = new Date();

        await user.save();
        res.redirect('/login.html');
    } catch (e) {
        console.log(e);
        res.send('Error!');
    }
});

router.get('/logout', function (req, res) {
    if (req.isAuthenticated) {
        req.logout();
        res.redirect('/');
    }
})

module.exports = router;