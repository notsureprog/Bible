const mongoose = require('mongoose');
// const Joi = require('joi');
// const env = require('dotenv').config();
// const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX

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
    highlightedVerses: [
        
    ]
    
});



mongoose.model('User', userSchema);

