var express = require('express');
var router = express.Router();
const Document = require('./../databases/mongodb/models/Document');
const Exercise = require('./../databases/mongodb/models/Excercise');
const AnswerSheet = require('./../databases/mongodb/models/AnswerSheet');
const constants = require('./../utils/constants');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v1');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/audios/');
    },
    filename: function (req, file, cb) {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 50000000 } });

router.post('/', async function (req, res, next) {
    console.log(req.body);

    let result = { status: 200 };

    try {
        switch (req.body.type) {
            case constants.EXERCISE.TYPE.LISTEN_AND_REWRITE: {
                answerSheet = new AnswerSheet();
                answerSheet.createdDate = new Date();
                answerSheet.updatedDate = answerSheet.createdDate;
                answerSheet.createdBy = req.user._id;
                answerSheet.exercise = req.body.exerciseId;
                answerSheet.classId = req.body.classId;
                answerSheet.type = req.body.type;
                answerSheet.content = req.body.answers;


                let exer = await Exercise.findById(req.body.exerciseId);

                let resultData = {};
                for (let item of exer.content) {
                    resultData[item.audioId] = item.text;
                }

                for (let item of req.body.answers) {
                    resultData[item.audioId] = (item.text === resultData[item.audioId] ? true : false);
                }

                for (let attr in resultData) {
                    if (resultData[attr] !== true) {
                        resultData[attr] = false;
                    }
                }

                result.data = resultData;

                await answerSheet.save();
                break;
            }
            case constants.EXERCISE.TYPE.FILL_MISSING_WORDS: {
                answerSheet = new AnswerSheet();
                answerSheet.createdDate = new Date();
                answerSheet.updatedDate = answerSheet.createdDate;
                answerSheet.createdBy = req.user._id;
                answerSheet.exercise = req.body.exerciseId;
                answerSheet.classId = req.body.classId;
                answerSheet.type = req.body.type;
                answerSheet.content = req.body.answers;

                let exer = await Exercise.findById(req.body.exerciseId);

                let resultData = {};
                for (let item of exer.content.texts) {
                    resultData[item.textId] = item.text;
                }

                for (let item of req.body.answers) {
                    resultData[item.textId] = (item.text === resultData[item.textId] ? true : false);
                }

                for (let attr in resultData) {
                    if (resultData[attr] !== true) {
                        resultData[attr] = false;
                    }
                }

                result.data = resultData;
            }                              
        }
    } catch (e) {

        console.log(e);
        result.status = 500;
    } finally {
        res.json(result);
    }

    // let result = { status: '200' };  

    // try {
    //     let data = req.body;
    //     let doc = null;

    //     if (!data.id) {
    //         doc = new Document();
    //         doc.createdDate = new Date();
    //         doc.updatedDate = doc.createdDate;
    //         doc.createdBy = req.user._id;
    //         doc.name = data.name;
    //         doc.description = data.description;
    //         doc.content = data.content;
    //         doc.classId = data.classId;
    //         doc.type = 'normal';
    //     } else {
    //         doc = await Document.findById(data.id);
    //         doc.updatedDate = new Date();
    //         doc.name = data.name;
    //         doc.description = data.description;
    //         doc.content = data.content;
    //         doc.classId = data.classId;
    //         doc.type = 'normal';
    //     }

    //     await doc.save();
    // } catch (e) {
    //     result.status = 500;
    //     console.log(e);
    // } finally {
    //     res.json(result);
    // }

});

router.get('/', async function (req, res) {

    let data = { status: 200, data: [] };

    try {
        let role = req.query.role;
        let classId = req.query.classId;
        let result;

        //  if (role == constants.CLASS.ROLE.TEACHER)
        //        result = await Document.find({ classId: classId, createdBy: req.user._id }).sort({ createdDate: -1 });
        result = await Exercise.find({ classId: classId }).sort({ createdDate: -1 });
        data.data = result;
        //res.render('class', dataToRender);

    } catch (e) {
        console.log(e);
        data.status = 500;
    } finally {
        res.json(data);
    }
});

module.exports = router;