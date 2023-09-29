const mongoose = require('mongoose');
const User = mongoose.model('User')
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const {authorization} = req.headers 
    console.log(authorization)

    if (!authorization) {
        return res.status(401).send('You are logged in already')
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'a', async (err, payload) => {
        // payload is only iat
        console.log(payload)
        if (err) {return res.status(401).send('Key does not match')}
        const {userData} = payload
        const user = await User.findById(userData)
        console.log(user)
        req.user = user
        next()
    })
}