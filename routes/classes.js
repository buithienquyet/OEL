var express = require('express');
var router = express.Router();
const Class = require('./../databases/mongodb/models/Class');
const constants = require('./../utils/constants');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('classes', { user: req.user });
});

router.get('/list', async function(req, res, next) {
    let data = { status: 200 };
    try {
        let result = await Class.find({
            $or: [
                { 'type': 'public' },
                { 'createdBy': req.user._id }
            ]
        })
        data.data = result;
    } catch (e) {
        console.log(e);
        data.status = 500;
    } finally {
        res.json(data);
    }
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

router.post('/', async function(req, res, next){
    let data = { status: 200 };
    try {
        const body = req.body;
        const newClass = new Class();
        const date = new Date();

        newClass.name = body.name;
        newClass.description = body.description;
        newClass.type = body.type;
        newClass.createdBy = req.user._id;
        newClass.updatedDate = newClass.createdDate = date;

        await newClass.save();        
    } catch (e) {
        console.log(e);
        data.status = 500;
    } finally {
        res.json(data);
    }
})

module.exports = router;