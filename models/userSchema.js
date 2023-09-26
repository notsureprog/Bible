const mongoose = require('mongoose');
const Joi = require('joi');
const env = require('dotenv').config();
const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX

const userSchema = mongoose.Schema(uri, {
    username: Joi.string().min(8).max(20),
    password: Joi.string().min(8).max(20),
    // username: Joi.string().min(8).max(20).regex('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])').required(),
    // password: Joi.string().min(8).max(20).regex('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])').required(),
    // bio: Joi.string(),
    email: Joi.string().email()
    // storedVerses: Joi.array()
});

userSchema.virtual('url', function() {
    return `/api/register/${this._id}`
})

mongoose.model('userSchema', userSchema);
// module.exports = {userSchema}