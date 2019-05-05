var express = require('express');
var router = express.Router();
const Document = require('./../databases/mongodb/models/Document');
// const Exercise = require('./../databases/mongodb/models/Excercise');
// const AnswerSheet = require('./../databases/mongodb/models/AnswerSheet');
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

router.get('/viewer', async function (req, res, next) {
    try {
        const documentId = req.query.id;

        const doc = await Document.findById(documentId);

        if (!doc || doc.type != constants.DOCUMENT.TYPE.PDF) {
            res.send('document not found!');
        }
        else {
            res.render('pdf', { documentName: doc.name, name: doc.content.name, audioData: JSON.stringify(doc.content.audioData) });
        }
    } catch (e) {
        console.log(e);
        result.status = 500;
    }
});

module.exports = router;