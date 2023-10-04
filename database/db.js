const mongoose = require('mongoose');
const env = require('dotenv').config()
const bcrypt = require('bcrypt');
// const { Alert } = require('react-native');
// require('../models/userSchema');


const uri = process.env.REACT_APP_MONGODB_CONNECTION_STRING_PREFIX

const connect = mongoose.connect(uri)
// console.log(connect)


const postUserToDatabase = async (username, password, email) => {

    // console.log(user.password)
    try {
        await connect
        const User = mongoose.model('User')

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) { throw err }
            const user = new User({ username: username, password: hash, email: email });
            await user.save()
            console.log('User Submitted')
        })
    } catch (error) {
        console.log(error)
    }
}

const getUserFromDatabase = async (username, password) => {
    console.log(password) //not null here

    try {
        await connect
        const User = mongoose.model('User')
        const result = await User.findOne({ username: username })
        console.log("result in the db")
        console.log(result) //null
        console.log("End result in the db")
        if (result === null) {
            console.log("No user was found")
            // they are null if the user is not found in db... but how do i stop the user from logging in
            return { username: null, password: null }
        }
        
        const pword = result.password
        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(hash)
            bcrypt.compare(password, pword, async (err, match) => {
                console.log("Password and Hash")
                console.log(hash)
                console.log(pword)
                console.log("End password and hash")
                if (err) { throw err }
                console.log(match)
                // match already compares the two passwords
                if (match) {
                    // i need to set the state down here
                    console.log('Yes')
                    console.log(result) //this is the object in mongodb
                    return result.username
                } else {
                    return "User not Found"
                }
            })
        })

    } catch (error) {
        console.log(error);
    }
}

const dropUserFromDatabase = async (username, password) => {
    await connect
    const dropUser = await mongoose.createConnection(uri)
    await dropUser.collection('collections').deleteOne({ username: username, password: password })
}

module.exports = { postUserToDatabase, getUserFromDatabase }