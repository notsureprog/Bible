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
    // app.post('/login/:username/:password', async (req, res, next) => {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password

    // dont want it to get ugly, but this seems ok
    // const fetchUser = await getUserFromDatabase(username, password)
    // console.log("Result from func")
    // // await fetchUser
    // console.log(fetchUser)
    // // console.log(await fet)
    // if (fetchUser === null) {
    //     res.status(404).send("User was not found");
    //     res.send("User was not found");
    // } 
    // else {
    getUserFromDatabase(username, password);
    const token = jwt.sign({ username: username }, password)

    res.send({ token: token, username: username });
    // }

    next()
})

app.get('/', requireAuth, (req, res) => {
    res.redirect('http://localhost:19006/Home')
})


app.listen(3000, () => console.log('listening'))
