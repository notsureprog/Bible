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
        const user = new User({ username: username, password: password, email: email });
        // maybe only connect once outside of the func
        const postToDb = await mongoose.createConnection(uri)
        
        // second test
        // user.password
        bcrypt.hash(password, 10, async (err, hash) => {
            bcrypt.compare(password, hash, async (err, match) => {
                if (err) { throw err }
                console.log(match)
                if (match) { 
                    const user = new User({ username: username, password: hash, email: email });
                    await user.save()
                    
                    // user is all of the object but no hash
                    // await postToDb.collection('collections').insertOne({username: username, password: hash, email: email})
                    console.log('good')
                } else {
                    console.log('bad')
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const getUserFromDatabase = async (username, password) => {
    // the register form took care of the check password before submit. 

    try {
        await connect
        const getUser = await mongoose.createConnection(uri)
        // 
        // const passInDb = result.password
        // console.log(passInDb)
        await getUser.collection('collections').findOne({ username: username, password: password })
        console.log(await getUser.collection('collections').findOne({ username: username, password: password }))
        bcrypt.hash(password, 10, async (err, hash) => {
            const passSubmitted = hash
            // const passInDb = await bcrypt.compare(result.password, hash)
            if (passSubmitted) {
                // bcrypt.compare()

            } else {
                console.log('error')
            }
        })
        console.log(await getUser.collection('collections').findOne({ username: username, password: password }))

    } catch (error) {
        console.log(error);
    }
}

const dropUserFromDatabase = async (username, password) => {
    await connect
    const dropUser = await mongoose.createConnection(uri)
    // if the username and password are in the database, 
    // then execute the below command
    await dropUser.collection('collections').deleteOne({ username: username, password: password })
}

// change password
const updatePassword = async (username, password, newPassword, confirmNewPassword) => {

    await connect

    const saltRounds = 10
    const updateUser = await mongoose.createConnection(uri)
    const genSaltForNewPassword = bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        const newPassHash = hash
        console.log(newPassHash)

    })
    const genSaltForNewConfirmPassword = bcrypt.hash(confirmNewPassword, saltRounds, (err, hash) => {
        const newConfirmPassHash = hash
        console.log(newConfirmPassHash)

    })

    await updateUser.collection('collections').updateOne({ username: username, password: password }, { $set: { username: username, password: newPassword } })
}

module.exports = { postUserToDatabase, getUserFromDatabase }