var express = require('express');
var router = express.Router();
const Document = require('./../databases/mongodb/models/Document');
const constants = require('./../utils/constants');
const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v1');
const { exec } = require('child_process');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/pdfs/files');
    },
    filename: function (req, file, cb) {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 50000000 } });

async function articlePostIndex(req, res, next) {
    let result = { status: '200' };

    try {
        let data = req.body;
        let doc = null;

        if (!data.id) {
            doc = new Document();
            doc.createdDate = new Date();
            doc.updatedDate = doc.createdDate;
            doc.createdBy = req.user._id;
            doc.name = data.name;
            doc.description = data.description;
            doc.content = data.content;
            doc.classId = data.classId;
            doc.type = constants.DOCUMENT.TYPE.ARTICLE;
        } else {
            doc = await Document.findById(data.id);
            doc.updatedDate = new Date();
            doc.name = data.name;
            doc.description = data.description;
            doc.content = data.content;
            doc.classId = data.classId;
            doc.type = constants.DOCUMENT.TYPE.ARTICLE;
        }

        await doc.save();
    } catch (e) {
        result.status = 500;
        console.log(e);
    } finally {
        res.json(result);
    }
}

async function pdfPostIndex(req, res, next) {

    async function extractPdfData(fileName) {

        function runJavaProgram(fileLocation, outputFolder) {
            return new Promise(function (resolve, reject) {
                console.log(`java -jar "./utils/ExtractPdfAudios.jar" "${fileLocation}" "${outputFolder}"`);
                exec(`java -jar "./utils/ExtractPdfAudios.jar" "${fileLocation}" "${outputFolder}"`, (error, stdout, stderr) => {
                    const log = `stdout: ${stdout}\nstderr: ${stderr}\nexec error: ${error}`;
                    console.log(log);
                    fs.writeFileSync(__dirname+'/../logs/pdfs/' + fileName + '.log', log);

                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }

        function getAudioData(fileLocation) {
            const str = fs.readFileSync(fileLocation,'utf8');
            const result = {};
            const lines = str.split('\n');

            for (let line of lines) {
                line = line.trim();
                if (line === '')
                    continue;
                const data = line.split(' ');
                const pageIndex = data[0];

                const audioData = {
                    id: data[1],
                    left: data[2],
                    top: data[3],
                    width: data[4],
                    height: data[5]
                };

                if (!result[pageIndex]) {
                    result[pageIndex] = [audioData];
                }
                else {
                    result[pageIndex].push(audioData);
                }
            }

            return result;
        }

        const baseLocation = __dirname+'/../public/pdfs';
        fileNameWithoutExtension = fileName.split('.')[0];
        const outputFolder = baseLocation + '/pdf-data/' + fileNameWithoutExtension;
        const fileLocation = baseLocation + '/files/' + fileName;

        fs.mkdirSync(outputFolder);

        try {
            await runJavaProgram(fileLocation, outputFolder);
            //console.log(new Date());
        }
        catch (e) {
            throw new Error('excecute java program failure ' + e);
        }

        const audioData = getAudioData(outputFolder+'/audio.txt');
        
        return audioData;
    }

    let result = { status: '200' };

    try {
        let data = req.body;
        let doc = null;

        if (!data.id) {
            doc = new Document();
            doc.createdDate = new Date();
            doc.updatedDate = doc.createdDate;
            doc.createdBy = req.user._id;
            doc.classId = data.classId;
            doc.type = constants.DOCUMENT.TYPE.PDF;
            doc.name = data.name;
            doc.description = data.description;
            const fileName = req.file.filename;

            // console.log(new Date());
            const audioData = await extractPdfData(fileName);            
            // console.log(new Date());
            doc.content = {
                name : fileName,
                audioData
            }

        } else {
            doc = await Document.findById(data.id);
            doc.updatedDate = new Date();
            doc.classId = data.classId;
            doc.type = constants.DOCUMENT.TYPE.PDF;
            doc.name = data.name;
            doc.description = data.description;
            doc.content = data.content;
        }

        await doc.save();
    } catch (e) {
        result.status = 500;
        console.log(e);
    } finally {
        res.json(result);
    }
}

router.post('/', upload.single('pdf'), async function (req, res, next) {

    switch (req.body.type) {
        case constants.DOCUMENT.TYPE.ARTICLE:
            articlePostIndex(req, res, next);
            break;
        case constants.DOCUMENT.TYPE.PDF:
            pdfPostIndex(req, res, next);
            break;
        default: {
            res.json({ status: 500, msg: 'Loại bài tập không hợp lệ!' });
        }
    }
});

router.get('/', async function (req, res) {

    let data = { status: 200, data: [] };

    try {
        let role = req.query.role;
        let classId = req.query.classId;
        let result;

        //  if (role == constants.CLASS.ROLE.TEACHER)
        //        result = await Document.find({ classId: classId, createdBy: req.user._id }).sort({ createdDate: -1 });
        result = await Document.find({ classId: classId }).sort({ createdDate: -1 });
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