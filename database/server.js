
const express = require('express');
const env = require('dotenv').config();
const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX
const app = express();
const router = express.Router();
const cors = require('cors')
const Server = require('mongodb').Server;
const { ServerApiVersion } = require('mongodb');
const Joi = require('joi');
const MongoClient = require('mongodb').MongoClient;


app.use(cors());
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

app.get('/api/register/:username/:password/:email', async (req, res) => {
    // bad, but simple
    const username = req.params.username
    const password = req.params.password
    const email = req.params.email
    await client.connect()
    console.log('connected')
    const coll = await client.db().collection('collections').insertOne({username: username, password: password, email: email})
    console.log(coll)
    res.send(JSON.stringify(username + " has been submitted"))

    // const stuff = await req.params
    // console.log(stuff)
    // res.send(stuff)
})

app.get('/api/login/:username/:password', (req, res) => {
  console.log('cors errors...coming back')  
})

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

