const mongoose = require('mongoose');
const User = mongoose.model('User')
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express()

// const 
module.exports = async (req, res, next) => {
    
    const {authorization} = req.headers 
    console.log(authorization)

    if (!authorization) {
        return res.status(401).send('You are logged in already')
    }
    // take Bearer out of the jwt
    const token = authorization.replace('Bearer ', '');
    console.log(token)
    // i had to decode the jwt to ultimately verify.
    // https://github.com/auth0/node-jsonwebtoken/blob/master/decode.js
    const decoded = jwt.decode(token, 'BLAH')
    console.log(decoded)
    // may generate a random key, and store it in env.
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        const {userData} = decoded        
        const user = await User.findById(userData)
        req.user = user
        next()
    })
}