var express = require('express');
var router = express.Router();
const Class = require('./../databases/mongodb/models/Class');
const constants = require('./../utils/constants');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('classes', { user: req.user });
});

router.get('/:id', async function(req, res) {

    dataToRender = { user: req.user, role: constants.CLASS.ROLE.STUDENT };

    try {

        let result = await Class.findOne({ _id: req.params.id });

        if (result.createdBy.equals(req.user._id)) {
            dataToRender.role = constants.CLASS.ROLE.TEACHER;
            dataToRender.classData = result;
            res.render('class_teacher', dataToRender);
        } else {
            dataToRender.role = constants.CLASS.ROLE.STUDENT;
            dataToRender.classData = result;
            res.render('class_student', dataToRender);
        }

        //res.render('class', dataToRender);

    } catch (e) {
        console.log(e);
        res.send('error');
    }
});

module.exports = router;