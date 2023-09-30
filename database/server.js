require('../models/userSchema');
const requireAuth = require('../middleware/requireAuth')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// const authRoutes = require('../routes/authRoutes')
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())
// app.use(authRoutes)
const { postUserToDatabase, getUserFromDatabase } = require('./db');
// const { options } = require('joi');
app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': 'http://localhost:19006' });
    // res.header({ 'Access-Control-Allow-Origin': 'http://10.0.2.2:19006' });
    // res.header({ 'Access-Control-Allow-Origin': 'http://192.168.1.140' });
    next()
})

app.get('/secretpage', requireAuth, (req, res, next) => {
    const username = req.user.username
    console.log(res)
    console.log(`you are signed in as ${req.user.username}`)
    console.log(req.body.username)
    console.log(req.body.password)
    res.redirect('http://localhost:19006/Home');
    
})

app.post('/api/register/:username/:password/:confirmPassword/:email', (req, res, next) => {
    console.log(req.body)
    const username = req.params.username
    const password = req.params.password
    const email = req.params.email
    postUserToDatabase(username, password, email)
    // res.send(await userData.token)
    console.log(res.status) 
    const token = jwt.sign({ username: username }, 'MY_SECRET_KEY')
    res.send({ token: token, });
    // res.render(`You Have Successfully Registered <br /><button onClick={() => ${res.redirect('http://localhost:19006/Home')}}>Go Back</button`);

    // const token = jwt.sign({ userId: userData._id }, 'MY_SECRET_KEY')

    // res.send({ token: token });

})

app.post('/login/:username/:password', requireAuth, async (req, res, next) => {
    // console.log("begin req")
    // console.log(req)
    // console.log("end req")
    console.log(req.body.username)
    console.log(req.body.password)
    const username = req.params.username
    const password = req.params.password
    console.log(req.params.username)
    console.log(req.params.password)
    // console.log('cors errors...coming back')
    
    getUserFromDatabase(username, password);

    const token = jwt.sign({ username: username }, password)
    res.send({ token: token });

    // console.log(userData)
    // bcrypt.compare(req.params.password === getUser.collection('collections').findOne({password: password}))
    next()
})

app.get('/', requireAuth, (req, res) => {
    res.redirect('http://localhost:19006/Home')
})


app.listen(3000, () => console.log('listening'))
