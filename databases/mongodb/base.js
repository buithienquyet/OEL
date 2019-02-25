const mongoose = require('mongoose');
const config = require('./../../config');

async function connect() {
    try {
        await mongoose.connect(config.database.mongodb.url, { useNewUrlParser: true });
        console.log('connected to mongodb database');
    } catch (e) {
        console.log('connect to database error', e);
    }
}

exports.connect = connect;