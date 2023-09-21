
const express = require('express');
const test = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX
const app = express();
const env = require('dotenv');
// import {REACT_APP_MONGODB_CONNECTION_STRING_PREFIX} from '@env'
console.log(test)
const Server = require('mongodb').Server;
const { ServerApiVersion } = require( 'mongodb');
// console.log(process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX);
// console.log(REACT_APP_MONGODB_CONNECTION_STRING_PREFIX) 
const MongoClient = require('mongodb').MongoClient;

const uri = `/Bible`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const GetDatabase = async () => {
    try {
        const result = []
        const collectionInformation = []
        await client.connect()
        console.log('connected');
        const dbRes = await client.db().admin().listDatabases()
        
        console.log(dbRes)
        for (const database of dbRes.databases) {
            const collections = await client.db(database.name).listCollections().toArray()
            const collectionNames = collections.map(col => col.name);
            result.push({database: database.name, collections: collectionNames})
        }
        const listOfDbs = result.map(d => {
            console.log(d.database)
        })
        
        console.log(collectionInformation)
    } catch(err) {
        console.log(err)
    } finally {
        console.log("Done")
    }
}


GetDatabase().catch(console.dir)
