const { number } = require('joi');
const mongoose = require('mongoose');

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
         //the object inside must be unique on all params (all together. There can be multiple verse 1 (Like Matthew 6:1 and Mark 6:1 is good), but not Mark 6:1 and Mark 6:1).
        // verse: number
    ]
    
});

mongoose.model('User', userSchema);

