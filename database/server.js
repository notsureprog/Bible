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
app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': 'http://localhost:19006' });
    // res.header({ 'Access-Control-Allow-Origin': 'http://10.0.2.2:19006' });
    // res.header({ 'Access-Control-Allow-Origin': 'http://192.168.1.140' });
    next()
})

app.get('/', requireAuth, (req, res) => {
    console.log(res)

    // res.redirect('http://localhost:19006/Home');
})

app.post('/api/register/:username/:password/:confirmPassword/:email', async (req, res) => {
    console.log(req.body)
    const username = req.params.username
    const password = req.params.password
    const email = req.params.email
    const userData = postUserToDatabase(username, password, email)
    // res.send(await userData.token)
    const token = jwt.sign({ userId: userData._id }, password)
    res.send({ token: token });
    // const token = jwt.sign({ userId: userData._id }, 'MY_SECRET_KEY')

    // res.send({ token: token });

})

app.post('/api/login/:username/:password', async (req, res) => {
    // console.log("begin req")
    // console.log(req)
    // console.log("end req")
    const username = req.params.username
    const password = req.params.password
    // console.log(req.params.username)
    // console.log(req.params.password)
    // console.log('cors errors...coming back')
    getUserFromDatabase(username, password);

    // const token = jwt.sign({ userId: userData._id }, password)
    // res.send({ token: token });

    // console.log(userData)
    // bcrypt.compare(req.params.password === getUser.collection('collections').findOne({password: password}))
})


app.listen(3000, () => console.log('listening'))
