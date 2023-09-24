
const express = require('express');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
// const {HttpsProxyAgent} = require('https-proxy-agent');
const axios = require('axios');
const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX
const app = express();
// app.use(express.json())
const router = express.Router();
const cors = require('cors');
const Server = require('mongodb').Server;
const { ServerApiVersion } = require('mongodb');
const Joi = require('joi');
const MongoClient = require('mongodb').MongoClient;

// const httpsAgent = new HttpsProxyAgent({host: 'http://192.168.1.140', port: 8081})
// axios.create({httpsAgent})
app.use(cors());
// const jsonParser = bodyParser.json({type: 'application/json'})
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})
// const client = mongoose.connect(uri, {
//     username: String,
//     password: String,
//     email: String
// })
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use((req, res, next) => {
    console.log(req.body)
    console.log(req)
    
    // bodyParser.json()
    
    res.header({'Access-Control-Allow-Origin': 'http://10.0.2.2:19006'});
    res.header({'Access-Control-Allow-Origin': 'http://localhost:19006'});
    next()
})

app.post('/api/register/:username/:password/:confirmPassword/:email', async (req, res) => {
    console.log('body')
    console.log(req)
    console.log('end body')
    const saltRounds = 10;
    await client.connect()
    // bad, but simple
    const password = req.params.password
    const username = req.params.username
    const email = req.params.email
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.params.password, salt, (err, hash) => {
            console.log(hash)
        })
    })
    const coll = await client.db().collection('collections').insertOne({ username: username, password: password, email: email })
    console.log('connected')
    console.log(coll)
    res.send(JSON.stringify(username + " has been submitted"))

    // const stuff = await req.params
    // console.log(stuff)
    // res.send(stuff)
})

app.get('/api/login/:username/:password', (req, res) => {
    console.log(req.params.username)
    console.log(req.params.password)
    console.log('cors errors...coming back')
    // bcrypt.compare(req.params.password === client.db().collection('collections').)
})

app.get('/api/delete/:username', (req, res) => {

})

// app.get('/users/storeverse')

// router.get
// const GetDatabase = async () => {
//     try {
//         const result = []
//         const collectionInformation = []
//         await client.connect()
//         console.log('connected');
//         const dbRes = await client.db().admin().listDatabases()
//         console.log("Databases")
//         console.log(dbRes)
//         console.log("End list of databases")
//         for (const database of dbRes.databases) {
//             const collections = await client.db(database.name).listCollections().toArray()
//             const collectionVal = client.db(database.name).collection('testingapost')

//             const collectionNames = collections.map(col => col.name);
//             result.push({ database: database.name, collections: collectionNames })

//         }
//         const listOfDbs = result.map(d => {
//             console.log(d.database)
//         })


//         console.log(collectionInformation)
//     } catch (err) {
//         console.log(err)
//     } finally {
//         console.log("Done")
//         client.close()
//     }
// }

// router.get
// const GetUserFromDatabase = async (username, password) => {
//     await client.connect();
//     // const user = []
//     const getUser = await client.db().admin().validateCollection('collections')
//     console.log(getUser)
// }

// router.post

const PostUserToDatabase = async (username, password, email) => {

}
app.listen(3000, () => console.log('listening'))

// router.use('/', router);

// GetDatabase().catch(console.dir)
// GetUserFromDatabase().catch(console.dir)

