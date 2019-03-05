var express = require('express');
var router = express.Router();
const Document = require('./../databases/mongodb/models/Document');
const Exercise = require('./../databases/mongodb/models/Excercise');
const constants = require('./../utils/constants');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v1');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/audios/');
    },
    filename: function(req, file, cb) {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 50000000 } });

router.post('/', upload.array('files', 12), async function(req, res, next) {

    console.log(req.files);
    console.log(req.body);

    let result = { status: 200 };

    try {
        switch (req.body.exerciseType) {
            case constants.EXERCISE.TYPE.LISTEN_AND_REWRITE:
                {
                    let exer;

                    if (req.body.id) {

                        exer = await Exercise.findById(req.body.id);
                        exer.updatedDate = new Date();
                        exer.name = req.body.name;
                        exer.description = req.body.description;

                        exer.content = exer.content.filter(function(e) {
                            let exist = false;

                            for (let item of req.body.audioIds) {
                                if (e.audioId == item)
                                    exist = true;
                            }
                            return exist;
                        });


                        let fileIdx = 0;

                        for (let i = 0; i < req.body.texts.length; i++) {

                            let exist = false;

                            for (let j = 0; j < exer.content.length; j++) {
                                let item = exer.content[j];
                                if (item.audioId == req.body.audioIds[i]) {
                                    item.text = req.body.texts[i];
                                    if (req.body.hasFiles[i] == true) {
                                        item.audio = req.files[fileIdx].filename;
                                        fileIdx++;
                                    }
                                    exist = true;
                                    break;
                                }
                            }

                            if (!exist) {
                                exer.content.push({
                                    text: req.body.texts[i],
                                    audio: req.files[i].filename,
                                    audioId: uuid()
                                });
                                fileIdx++;
                            }
                        }


                    } else {
                        exer = new Exercise();

                        exer.createdDate = new Date();
                        exer.updatedDate = exer.createdDate;
                        exer.createdBy = req.user._id;
                        exer.name = req.body.name;
                        exer.description = req.body.description;
                        exer.classId = req.body.classId;
                        exer.type = req.body.exerciseType;

                        let content = [];

                        for (let i = 0; i < req.body.texts.length; i++) {
                            content.push({
                                text: req.body.texts[i],
                                audio: req.files[i].filename,
                                audioId: uuid()
                            });
                        }

                        exer.content = content;
                    }

                    await exer.save();

                    return;
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

router.get('/', async function(req, res) {

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