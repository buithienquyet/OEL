var express = require('express');
var router = express.Router();
const Document = require('./../databases/mongodb/models/Document');
const constants = require('./../utils/constants');

router.post('/', async function(req, res, next) {

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
            doc.type = 'normal';
        } else {
            doc = await Document.findById(data.id);
            doc.updatedDate = new Date();
            doc.name = data.name;
            doc.description = data.description;
            doc.content = data.content;
            doc.classId = data.classId;
            doc.type = 'normal';
        }

        await doc.save();
    } catch (e) {
        result.status = 500;
        console.log(e);
    } finally {
        res.json(result);
    }

});

router.get('/', async function(req, res) {

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