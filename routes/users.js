var express = require('express');
var router = express.Router();
const User = require('../databases/mongodb/models/User');

/* GET users listing. */
router.get('/', async function (req, res, next) {

    const data = {
        status: 200,
        data: null
    }

    try {
        const users = await User.find({}, '_id firstName lastName phoneNumber');
        for (let user of users) {
            let newPhone = '';

            for (let i = 0; i < user.phoneNumber.length; i++) {                
                newPhone += (i<6?'*':user.phoneNumber.charAt(i));              
            }

            user.phoneNumber= newPhone;
        }
        data.data = users;
    }
    catch (e) {
        console.error('get user list: ', e);
        data.status = 500;
    }
    finally {
        res.json(data);
    }

});

module.exports = router;