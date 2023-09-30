const mongoose = require('mongoose');
const User = mongoose.model('User')
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express()

// const 
module.exports = async (req, res, next) => {
    
    // const email = req.body.email
    const {authorization} = req.headers 
    console.log(authorization)

    if (!authorization) {
        return res.status(401).send('You are logged in already')
    }

    const token = authorization.replace('Bearer ', '');
    console.log(token)

    const decoded = jwt.decode(token, 'BLAH')
    console.log(decoded)
    

    // try {
    //     const obj = JSON.parse(decoded)
    //     if (typeof(obj) === 'string') {
    //         console.log(obj)
    //         return obj
    //     }
    // } catch(err) {
    //     console.log(err)
    // }

    
    // jwt.verify(token, 'MY_SECRET_KEY', function(err, decoded) {
    //     console.log(decoded)
    // })
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        // payload is only iat
        console.log(payload)
        // if (err) {return res.status(401).send('Key does not match')}
        const {userData} = decoded
        console.log(userData)
        
        
        console.log(userData)
        
        const user = await User.findById(userData)
        console.log(user)
        req.user = user
        // req.header = header
        next()
    })
}