
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
export const registerUsers = createAsyncThunk(`/register`, async (thunkApi) => {
    console.log(typeof (thunkApi))

    try {
        const response = axios.post(`${uri}/register`, thunkApi)
        return response.data
        // const response = await fetch(`${uri}/api/register/`, {
    //     const response = await fetch(`${uri}/register/${thunkApi.username}/${thunkApi.password}/${thunkApi.confirmPassword}/${thunkApi.email}`, {
    //         method: 'POST',
    //         // body: {username: thunkApi.username, password: thunkApi.password, confirmPassword: thunkApi.confirmPassword, email: thunkApi.email},
    //         headers: {
    //             'Content-Type': 'application/json',

    //         }
    //     })
    //     // console.log(response)
    //     if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    //     const body = await response.json()
    //     console.log('body')
    //     console.log(body)
    //     // console.log(typeof(body))
    //     console.log(body)
    //     await AsyncStorage.setItem('access-token', body.token)
    //     console.log(body.token)
    //     // const username = body.username
    //     // const token = body.token
    //     console.log('end body')
    //     return body
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

export const loginUsers = createAsyncThunk(`/login`, async (thunkApi, { rejectWithValue }) => {
    try {
        // const { currentRequestId, loading } = store.getState().authenticate
        console.log(thunkApi)
        const response = await axios.post(`${uri}/login`, thunkApi)
        await AsyncStorage.setItem('access-token', response.data.token)
        return response.data
    }
    catch (err) {
        rejectWithValue(err.response.data)
    }
},
    // FORCE CANCELLATION ON EVEN GOOD REQUESTS
    // test commented out...
    //  {
    //     // Canceling Before Execution... No wonder...
    // // unreachable thunkApi
    //     condition: (thunkApi, { getState, extra }) => {
    //         const data  = getState()
    //         console.log(data)
    //         const fetchStatus = data.requests[thunkApi]
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
        username: null, //guest
        email: null,
        token: null,
        loading: 'idle',
        isLoggedIn: false, //only bool right now
        authenticatedUser: {},
        currentRequestId: null
    },

    reducers: {
        submitUser(state, action) {
            console.log(current(state))
            state.users.push(action.payload)
            console.log(current(state))
        },
        logoutUser(state, action) {
            state.token = null
            state.username = null
            state.loading = 'idle'
            state.isLoggedIn = false //i will probably take this out... ahtough guest has a token
            state.currentRequestId = null //maybe undefined
        }
    },

    extraReducers: (builder) => {
        builder
            // register user cases
            .addCase(registerUsers.fulfilled, (state, action) => {
                // const {requestId} = action.meta
                // console.log(data)
                // if (state.loading === 'pending' && requestId === currentRequestId) {

                //     console.log(action.payload)
                // }
                // state.authenticate = action.payload.body.username

            })
            .addCase(registerUsers.pending, (state, action) => {
                // getUserFromDb
                // action.payload = "Submitting User. Please Wait...???" //I think that is how this works.
                state.loading = 'pending'
                state.isLoggedIn = false
                state.token = null

            })
            .addCase(registerUsers.rejected, (state, action) => {
                action.payload = "Something went wrong in the sign up process"
            })
            .addCase(loginUsers.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(requestId)
                if (state.loading === 'pending' && requestId === state.currentRequestId) {
                    console.log("setting back to idle (initial state) and fulfilled")
                    state.loading = 'idle'
                    // user gets the token and logged in
                    state.token = action.payload.token
                    state.isLoggedIn = true //maybe i should omit if token is present
                    state.currentRequestId = undefined
                }
                state.username = action.payload.username
                state.token = action.payload.token
                state.loading = 'success'
                state.isLoggedIn = true


            })
            .addCase(loginUsers.pending, (state, action) => {
                const currentRequestId = action.meta.requestId
                console.log(currentRequestId)
                if (state.loading === 'idle') {
                    state.loading === 'pending'
                    state.currentRequestId = action.meta.requestId
                }
                state.isLoggedIn = false
                state.loading = 'loading'
            })
            .addCase(loginUsers.rejected, (state, action) => {
                state.isLoggedIn = false
                state.loading = 'failed'
            })
    }
});

// export const registerUserIdle = (state, action) => {return {...state, loading: 'loading'}}
const putUserInDatabase = (state, action) => { return { username: action.payload.username } }
// const getUserFromDB = (registerUser.pending)
// deleteUser, updateUser

export const { submitUser, logoutUser } = authSlice.actions

export default authSlice.reducer
// not needed i do not believe
export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)