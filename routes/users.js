var express = require('express');
var router = express.Router();
const User = require('../databases/mongodb/models/User');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let user = new User();
    user.userName = 'btq';
    user.firstName = 'Quyet';
    user.lastName = 'Bui';
    user.password = '12345';

    await user.save();

    res.send('ok');

});

module.exports = router;