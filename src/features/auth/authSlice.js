
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import fetch from 'node-fetch'
// import http from 'http'
import { Platform } from 'react-native'
import { REACT_APP_EXPRESS_URL } from '@env'
// import { HttpsProxyAgent } from 'https-proxy-agent'
// 

// Killed my ngrok server to get a new url, but this solves the android to express api network error issue. May just invest in ngrok now.
// I get an undefined pushed to the users array on first iteration... It needs to stop
const uri = Platform.OS === 'web' ? 'http://localhost:3000' : `${REACT_APP_EXPRESS_URL}`
// const httpsAgent = new HttpsProxyAgent({host: 'http://localhost:3000'})
// createAsyncThunk will deal with the backend
// accepts a Redux action type string (/api/users) and a call back fn 
// when the api responds back to middleware it is pending, fulfilled, or rejected
export const registerUsers = createAsyncThunk(`/api/register`, async (thunkApi) => {
    console.log(typeof (thunkApi))

    try {
        // const response = await fetch(`${uri}/api/register/`, {
        const response = await fetch(`${uri}/api/register/${thunkApi.username}/${thunkApi.password}/${thunkApi.confirmPassword}/${thunkApi.email}`, {
            method: 'POST',
            // body: {username: thunkApi.username, password: thunkApi.password, confirmPassword: thunkApi.confirmPassword, email: thunkApi.email},
            headers: {
                'Content-Type': 'application/json',

            }
        })
        // console.log(response)
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        const body = await response.json()
        console.log('body')
        console.log(body)
        // console.log(typeof(body))
        console.log(body)
        await AsyncStorage.setItem('access-token', body.token)
        console.log(body.token)
        // const username = body.username
        // const token = body.token
        console.log('end body')
        return body
    } catch (err) {
        console.log(err)
    }
    // returns a promise
    //     const response = await axios.post(`${uri}/api/register/${thunkApi.username}/${thunkApi.password}/${thunkApi.confirmPassword}/${thunkApi.email}`, {
    //         validateStatus: (status) => {
    //             return status < 500
    //         },

    //         // proxy: {
    //         //     protocol: 'http',
    //         //     host: '10.0.2.2/api/register',
    //         //     port: 3000
    //         // },


    //     })
    //     console.log(response.data)
    //     // console.log(localStorage.setItem('userToken', response.data.userToken));
    //     return response.data
    // } catch (err) {
    //     if (err.response) {
    //         console.log('data error')
    //         console.log(err.response.data)
    //         console.log('end data error')
    //         console.log('status error')
    //         console.log(err.response.status)
    //         console.log('end status error')
    //         console.log('header error')
    //         console.log(err.response.headers)
    //         console.log('end header error')
    //     } else if (err.request) {
    //         console.log('request error')
    //         console.log(err.request)
    //         console.log('end request error')
    //     } else {
    //         console.log('Error', err.message)
    //     }
    //     return err.message
    // }

    // on idle the dispatch will run through the thunk, try to post or get from the uri
})

export const loginUsers = createAsyncThunk(`/login`, async ( thunkApi, {rejectWithValue}) => {
// export const loginUsers = createAsyncThunk(`/login`, async (username, password, thunkApi, { rejectWithValue }) => {

    // console.log(username)
    // console.log(password)
    try {
        console.log(thunkApi)
        // I will leave the below code just as a reference
        // // const response = await fetch(`${uri}/login/${thunkApi.username}/${thunkApi.password}`, {
        // const response = await fetch(`${uri}/login`, {
        //     method: 'POST',
            

        // })
        // console.log(response.json())
        // // i suck lol

        // const body = await response.json()
        
        // // if user is in db, then...
        // // seems kind of spaghetti ish
        // // await AsyncStorage.setItem('access-token', body.token)
        // console.log(body)
        // return body
        
        // const options = {
        //     method: 'POST',
        //     url: `${uri}/login`,
        //     thunkApi
        // }
        const response = await axios.post(`${uri}/login`, thunkApi)
        
        console.log(response.data)
        return response.data
    }
     catch (err) {
        rejectWithValue(err.response.data)
        // console.log(err)
    }
},
// FORCE CANCELLATION ON EVEN GOOD REQUESTS
// test commented out...
//  {
//     // Canceling Before Execution... No wonder...
//     condition: (username, { getState, extra }) => {
//         const data  = getState()
//         console.log(data)
//         const fetchStatus = data.requests[username]
//         console.log(fetchStatus)
//         if (fetchStatus === 'fulfilled' || fetchStatus === 'loading') {
//             // Already fetched or in progress, don't need to re-fetch
//             return false
//           }
//     }
// }
)


// createSlice uses immer library internally
export const authSlice = createSlice({
    name: 'authenticate',
    initialState: {
        users: [],
        // I may be able to omit some of the below if this works
        // guest has no ability to highlight verses.
        username: null, //guest
        // password: null, //guest
        email: null,
        token: null,
        // confirmPassword: null,
        loading: 'idle',
        isLoggedIn: false, //only bool right now
        authenticatedUser: {}
    },

    reducers: {
        submitUser(state, action) {
            console.log(action.payload)
            console.log(current(state))
            state.users.push(action.payload)
            
            console.log(current(state))
        },

        getUser(state, action) {
            console.log(current(state))
            // state.username = action.payload.username
            // state.password = action.payload.password
            console.log(current(state))
        },
        logoutUser(state, action) {
            // getting ahead
            // state.authenticatedUser.token = await AsyncStorage.clear() //i think...
        }
        // deleteUser(state, action) {
        //     console.log('something')
        // },
        // updateUser(state, action) {

        // }

    },

    extraReducers: (builder) => {
        builder
            // register user cases
            .addCase(registerUsers.fulfilled, (state, action) => {
                // console.log(data)
                console.log(action.payload)
                // state.authenticate = action.payload.body.username
                // return {
                //     ...state,
                //     username: action.payload.username
                // }
            })
            .addCase(registerUsers.pending, (state, action) => {
                // action.payload = "Submitting User. Please Wait...???" //I think that is how this works.
                state.loading = 'pending',
                state.isLoggedIn = false

            })
            .addCase(registerUsers.rejected, (state, action) => {
                action.payload = "Something went wrong in the sign up process"
            })
            // end register users submit cases

            // begin login user submit cases
            .addCase(loginUsers.fulfilled, (state, action) => {
                // it acts as fulfilled
                // we test against db
                // state.users.push(action.payload)
                // state = action.payload //will it write to the state, or is it immutable?
                state.username = action.payload.username
                state.token = action.payload.token
                // state.authenticatedUser = action.payload
                state.loading = 'success'
                state.isLoggedIn = true


            })
            .addCase(loginUsers.pending, (state, action) => {
                state.isLoggedIn = false
                state.loading = 'loading'
            })
            .addCase(loginUsers.rejected, (state, action) => {
                state.isLoggedIn = false
                state.loading = 'failed'
            })
        // end login users submit cases
    }

});

// export const registerUserIdle = (state, action) => {return {...state, loading: 'loading'}}
const putUserInDatabase = (state, action) => { return { username: action.payload.username } }
// const getUserFromDB = (registerUser.pending)
// deleteUser, updateUser

export const { submitUser, getUser, logoutUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)