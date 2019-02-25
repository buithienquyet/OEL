const mongoose = require('mongoose');

let schema = {
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
}
const User = mongoose.model('User', schema, 'Users');

module.exports = User;