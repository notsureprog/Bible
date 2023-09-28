
require('../models/userSchema');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
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

app.post('/api/register/:username/:password/:confirmPassword/:email', async (req, res) => {
    console.log(req.body)
    const username = req.params.username
    const password = req.params.password
    const email = req.params.email
    postUserToDatabase(username, password, email)
    
})

app.get('/api/login/:username/:password', (req, res) => {
    const username = req.params.username
    const password = req.params.password
    console.log(req.params.username)
    console.log(req.params.password)
    console.log('cors errors...coming back')
    const userData = getUserFromDatabase(username, password);
    console.log(userData)
    // bcrypt.compare(req.params.password === getUser.collection('collections').findOne({password: password}))
})


app.listen(3000, () => console.log('listening'))
