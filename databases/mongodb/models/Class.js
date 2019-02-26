const mongoose = require('mongoose');
const { Schema } = mongoose;

schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    index: String,
    students: Array,
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedDate: Date,
    createdDate: Date,
    isBeingDeleted: Boolean,
    iconUrl: String,
    type: {
        type: String,
        required: true,
    }
});

schema.methods.isValidPassword = function(a) {
    return this.password == a
}

const Class = mongoose.model('Class', schema, 'Classes');

module.exports = Class;