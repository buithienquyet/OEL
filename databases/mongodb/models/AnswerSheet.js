const mongoose = require('mongoose');
const { Schema } = mongoose;

schema = new Schema({
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    updatedDate: Date,
    createdDate: Date,
    isBeingDeleted: Boolean,
    content: Object
});

const AnswerSheet = mongoose.model('AnswerSheet', schema, 'AnswerSheets');

module.exports = AnswerSheet;