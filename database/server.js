require('../models/userSchema');
const requireAuth = require('../middleware/requireAuth');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = express.Router()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser())
const { postUserToDatabase, getUserFromDatabase, putVerseInDatabase, removeVerseFromDatabase } = require('./db');

router.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': 'http://localhost:19006' });
    next()
})

router.get('/secretpage', requireAuth, (req, res, next) => {
    const username = req.user.username
    console.log(res)
    res.redirect('http://localhost:19006/Home');

})

router.post('/register', async (req, res, next) => {

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

router.post('/login', async (req, res, next) => {
    console.log("Hello server")
    const username = req.body.username
    const password = req.body.password
    try {
        await getUserFromDatabase(username, password, (err, data) => {

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
        next()
    }
});
// }

// })
// verse/add
router.post('/verse', async (req, res, next) => {
    const verse = req.body.verse
    const username = req.body.username
    const book = req.body.book
    const chapter = req.body.chapter
    const version = req.body.version
    console.log(req.body.verse)
    try {
        // I need to push into an array in db 
        await putVerseInDatabase(verse, username, book, chapter, version, (err, data) => {
            res.send(data) //reflects from the db into the ui and persisted...
            next()
        })
        // await removeVerseFromDatabase(verse, username, book, chapter, version)
    } catch (error) {
        console.log(error)
    }
})

router.post('/verse/delete', async (req, res) => {
    const verse = req.body.verse
    const username = req.body.username
    const book = req.body.book
    const chapter = req.body.chapter
    const version = req.body.version
    try {
        await removeVerseFromDatabase(verse, username, book, chapter, version, (err, data) => {
            res.send(data)
            next()
        })
    } catch (error) {
        console.log(error)
    }
})

app.use('/', router)


app.listen(3000, () => console.log('listening'))
