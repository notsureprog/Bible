const mongoose = require('mongoose');
const env = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX
const connect = mongoose.connect(uri)
const postUserToDatabase = async (username, password, email, callback) => {

    try {
        await connect
        const User = mongoose.model('User')

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) { throw err }
            const user = new User({ username: username, password: hash, email: email });
            await user.save()
            const token = jwt.sign({ username: username }, hash)
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
        // probably should find by the id of the user... although it is unique in model.
        const result = await User.findOne({ username: username })
        if (result === null) {
            console.log("No user was found")
            return { username: null, password: null }
        }
        const pword = result.password
        bcrypt.hash(password, 10, async (err, hash) => {
            bcrypt.compare(password, pword, async (err, match) => {
                console.log("Password and Hash")
                console.log(pword)
                console.log("End password and hash")
                if (err) { throw err }
                console.log(match)
                if (match) {
                    const token = jwt.sign({ username: result.username }, pword)
                    console.log(token)
                    callback(null, { username: result.username, token: token })
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
        await User.updateOne({ username: username }, { $set: { highlightedVerses: [verse] } })
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