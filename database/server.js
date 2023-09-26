
const express = require('express');
const env = require('dotenv').config();
const bodyParser = require('body-parser');
// const user_detail = require('../controllers/authController')

// const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX
const app = express();
const cors = require('cors');
// const Server = require('mongodb').Server;
// const { ServerApiVersion } = require('mongodb');
const { postUserToDatabase, getUserFromDatabase } = require('./db');
// const MongoClient = require('mongodb').MongoClient;


// const httpsAgent = new HttpsProxyAgent({host: 'http://192.168.1.140', port: 8081})
// axios.create({httpsAgent})
app.use(cors());
// const jsonParser = bodyParser.json({type: 'application/json'})
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true
//     }
// })
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

    res.header({ 'Access-Control-Allow-Origin': 'http://10.0.2.2:19006' });
    res.header({ 'Access-Control-Allow-Origin': 'http://localhost:19006' });
    next()
})

// app.use('userDetail', user_detail)

app.post('/api/register/:username/:password/:confirmPassword/:email', async (req, res) => {
    const username = req.params.username
    const password = req.params.password
    const email = req.params.email
    // test the hashes
    
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

// app.delete('/api/delete/:username', (req, res) => {

// })

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
app.listen(3000, () => console.log('listening'))

// router.use('/', router);

// GetDatabase().catch(console.dir)
// GetUserFromDatabase().catch(console.dir)

