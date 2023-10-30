const mongoose = require('mongoose');
const env = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX
const connect = mongoose.connect(uri)

// post user to the database in register form
const postUserToDatabase = async (username, password, email, callback) => {

    try {
        await connect
        const User = mongoose.model('User')
        // has the user password
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) { throw err }
            const user = new User({ username: username, password: hash, email: email });
            await user.save()
            const token = jwt.sign({ username: username }, hash)
            // callback to send result to server.js
            callback(null, { username: username, token: token })
        })
    } catch (error) {
        console.log(error)
    }
}

const getUserFromDatabase = async (username, password, callback) => {

    try {
        await connect
        const User = mongoose.model('User')
        // find the user by username in the db (it is unique). 
        const result = await User.findOne({ username: username })
        console.log(result)
        // no user in the db
        if (result === null) {
            console.log("No user was found")
            return { username: null, password: null }
        }
        // user's hashed password in mongodb
        const pword = result.password
        // compare if the password's hashes are matching.
        bcrypt.hash(password, 10, async (err, hash) => {
            bcrypt.compare(password, pword, async (err, match) => {
                if (err) { throw err }
                console.log(match)
                // boolean match from comparing two hashed passwords
                if (match) {
                    const token = jwt.sign({ username: result.username }, pword)
                    // callback to send information back to server.js
                    callback(null, { username: result.username, token: token, highlightedVerses: result.highlightedVerses })
                } else {
                    return "User not Found"
                }
            })
        })

    } catch (error) {
        console.log(error);
    }
}

// this will have to be persisted in the store too.
const putVerseInDatabase = async (verse, username, callback) => {
    try {
        await connect
        const User = mongoose.model('User')
        await User.updateOne({ username: username }, { $push: { highlightedVerses:  verse } })
        callback(null, verse)
    } catch (error) {
        console.log(error)
    }

}

const dropUserFromDatabase = async (username, password) => {
    await connect
    const dropUser = await mongoose.createConnection(uri)
    await dropUser.collection('collections').deleteOne({ username: username, password: password })
}

module.exports = { postUserToDatabase, getUserFromDatabase, putVerseInDatabase}