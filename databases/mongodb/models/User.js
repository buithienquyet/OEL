const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

schema = new Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    lastLoginTime: Date,
    birthday: Date,
    email: {
        type: String,
        default: ''
    },
    gender: String,
    updatedDate: Date,
    createdDate: Date,
    isBeingDeleted: Boolean,
    avatarUrl: String,
});

schema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', schema, 'Users');

module.exports = User;