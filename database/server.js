require('../models/userSchema');
const requireAuth = require('../middleware/requireAuth');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser())
const { postUserToDatabase, getUserFromDatabase } = require('./db');

app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': 'http://localhost:19006' });
    next()
})

app.get('/secretpage', requireAuth, (req, res, next) => {
    const username = req.user.username
    console.log(res)
    res.redirect('http://localhost:19006/Home');

})

app.post('/register', async (req, res, next) => {

    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    try {
        await postUserToDatabase(username, password, email, (err, data) => {
            // https://github.com/WebReflection/flatted
            res.send(data)
            next()

        })
    } catch (error) {
        console.log(error)
    }
    
})

app.post('/login', async (req, res, next) => {
    console.log("Hello server")
    const username = req.body.username
    const password = req.body.password
    try {
        await getUserFromDatabase(username, password, (err, data) => {
            console.log("Data from db.js")
            console.log(data)
            res.send(data)
            next()
        })
    }
    catch (error) {
        console.log(error)
    }
    console.log("Hopefully")
    if (username === 'guest') {
        const token = jwt.sign({ username: username }, password)
        res.send({ token: token, username: 'guest' });
        res.cookie('auth', token, {secure: true})
        next()
    }
});

app.get('/', requireAuth, (req, res) => {
    res.redirect('http://localhost:19006/Home')
})
// app.use(Router, '/')
app.listen(3000, () => console.log('listening'))
