const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

schema = new Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    address: String,
    lastLoginTime: Date,
    birthday: Date,
    email: String,
    gender: String,
    updatedDate: Date,
    createdDate: Date,
    isBeingDeleted: Boolean,
    avatarUrl: String,
});

schema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', schema, 'Users');

module.exports = User;