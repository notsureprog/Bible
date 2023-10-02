const mongoose = require('mongoose');
const env = require('dotenv').config()
const bcrypt = require('bcrypt')
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
        if (result === null) {
            alert("User was not found in the database")
        } else {
            // I need to set the state of username in redux
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
                        console.log('error')
                    }
                })
            })
        }
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