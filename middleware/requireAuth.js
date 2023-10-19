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

    const token = authorization.replace('Bearer ', '');
    console.log(token)

    const decoded = jwt.decode(token, 'BLAH')
    console.log(decoded)
    
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        const {userData} = decoded        
        const user = await User.findById(userData)
        req.user = user
        next()
    })
}