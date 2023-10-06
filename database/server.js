require('../models/userSchema');
const requireAuth = require('../middleware/requireAuth')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json())
// const jsonParser = bodyParser.json()

// // create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

const { postUserToDatabase, getUserFromDatabase } = require('./db');

app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': 'http://localhost:19006' });
    // res.header({ 'Access-Control-Allow-Origin': 'http://10.0.2.2:19006' });
    // res.header({ 'Access-Control-Allow-Origin': 'http://192.168.1.140' });
    next()
})

app.get('/secretpage', requireAuth, (req, res, next) => {
    const username = req.user.username
    console.log(res)
    // not valid json from the login on the actual app. problem likely in authSlice because it worked in postman

    res.redirect('http://localhost:19006/Home');

})

// I could take off the :username/:password and just destructure body on node fetch i think
app.post('/api/register/:username/:password/:confirmPassword/:email', (req, res, next) => {

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

// i will make it just login, and extract the body. Because of sensitive information.
app.post('/login', async (req, res, next) => {
    console.log("Hello server")
    // let obj = null
    const username = req.body.username
    const password = req.body.password
    // error handle callback
    await getUserFromDatabase(username, password, (err, data) => {
        try {
            console.log("Data from db.js")
            console.log(data)
            res.send(data)
            next()
        } catch (error) {
            console.log(error)
        }
        // if (err) {
        //     console.log("Error getting User")
        // }
        // else {
        //     res.send(data)
        // }   
    });
    console.log("Hopefully")
    // obj is null until second iteration...or if it is sent back null in dbjs
    // console.log(await dbRes)
    // I cannot send this without getUserFromDb... but I think it goes in the resultAction.type === '/login/pending'
    // i could make this guest anyways
    if (username === 'guest') {
        const token = jwt.sign({ username: username }, password)
        res.send({ token: token, username: 'guest' });
        next()
    }
    // }

})

app.get('/', requireAuth, (req, res) => {
    res.redirect('http://localhost:19006/Home')
})


app.listen(3000, () => console.log('listening'))
