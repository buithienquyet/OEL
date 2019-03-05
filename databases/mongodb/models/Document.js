const mongoose = require('mongoose');
const { Schema } = mongoose;

schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    updatedDate: Date,
    createdDate: Date,
    isBeingDeleted: Boolean,
    iconUrl: String,
    type: {
        type: String,
        required: true,
    },
    content: String
});

const Class = mongoose.model('Document', schema, 'Documents');

module.exports = Class;