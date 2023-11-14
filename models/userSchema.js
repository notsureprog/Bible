const { number } = require('joi');
const mongoose = require('mongoose');
const { unique } = require('underscore');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        // validate: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    // I actually want the ability to click and remove it anyways... so unSet if it is already in there.
    highlightedVerses: []//[]

});

mongoose.model('User', userSchema);

