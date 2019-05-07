var express = require('express');
var router = express.Router();
const Class = require('./../databases/mongodb/models/Class');
const User = require('./../databases/mongodb/models/User');
const constants = require('./../utils/constants');
const ObjectId = require('mongoose').Types.ObjectId;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('classes', { user: req.user });
});

router.get('/list', async function (req, res, next) {
    let data = { status: 200 };
    try {
        let result = await Class.find({
            $or: [
                { 'type': constants.CLASS.TYPE.PUBLIC },
                { 'students': { $elemMatch: { $eq: req.user._id } } },
                { 'createdBy': req.user._id }
            ]
        })

        if (req.query.search) {
            result = result.filter((e) => ((e.name + '').toLowerCase().includes((req.query.search + '').toLowerCase())));
        }

        data.data = result;
    } catch (e) {
        console.log(e);
        data.status = 500;
    } finally {
        res.json(data);
    }
});

router.get('/:id', async function (req, res) {

    dataToRender = { user: req.user, role: constants.CLASS.ROLE.STUDENT };

    try {

        let result = await Class.findOne({ _id: req.params.id });
        let studentPromises = [];

        for (let i = 0; i < result.students.length; i++) {
            let student = result.students[i];
            studentPromises.push(User.findById(student, '_id firstName lastName'));
        }

        result.students = await Promise.all(studentPromises);

        console.log(result.students);

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

router.post('/', async function (req, res, next) {
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

router.post('/:id', async function (req, res, next) {
    let data = { status: 200 };
    try {
        const body = req.body;
        const classData = await Class.findById(req.params.id);
        const date = new Date();

        classData.name = body.name;
        classData.description = body.description;
        classData.type = body.type;
        classData.students = body.students;
        classData.updatedDate = date;

        await classData.save();
    } catch (e) {
        console.log(e);
        data.status = 500;
    } finally {
        res.json(data);
    }
})

module.exports = router;