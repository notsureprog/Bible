import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'
import fetch from 'node-fetch'
// import http from 'http'
import { Platform } from 'react-native'
// import { HttpsProxyAgent } from 'https-proxy-agent'
// 

const uri = Platform.OS === 'web' || Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000'
// const httpsAgent = new HttpsProxyAgent({host: 'http://localhost:3000'})
// createAsyncThunk will deal with the backend
// accepts a Redux action type string (/api/users) and a call back fn 
// when the api responds back to middleware it is pending, fulfilled, or rejected
export const registerUsers = createAsyncThunk(`/api/register`, async (thunkApi) => {
    console.log(thunkApi)

    try {
        const response = await fetch(`${uri}/api/register/${thunkApi.username}/${thunkApi.password}/${thunkApi.confirmPassword}/${thunkApi.email}`, {
            method: 'POST', 
            // body: {username: thunkApi.username, password: thunkApi.password, confirmPassword: thunkApi.confirmPassword, email: thunkApi.email}
        })
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        const body = await response.json()
        console.log('body')
        console.log(body)
        console.log('end body')
        return body;
    }catch(err) {
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

export const loginUsers = createAsyncThunk(`/api/login`, async (thunkApi) => {
    try {
        const response = await fetch(`${uri}/api/login/${thunkApi.username}/${thunkApi.password}`, {
            method: 'GET',
            // body: {username: thunkApi.username, password: thunkApi.password}
        })

        const result = response.json()
        return result
        // const options = {
        //     method: 'GET',
        //     url: `${uri}/api/login/${thunkApi.username}/${thunkApi.password}`
        // }
        // const response = await axios(options)
        // console.log(response.data)
        // return response.data
    } catch (err) {
        console.log(err)
    }
})


// createSlice uses immer library internally
export const authSlice = createSlice({
    name: 'authenticate',
    initialState: {
        users: [],
        username: null,
        password: null,
        email: null,
        confirmPassword: null,
        loading: 'idle',
        isLoggedIn: false
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
            state.username = action.payload.username
            state.password = action.payload.password
            console.log(current(state))
        },
        // deleteUser(state, action) {
        //     console.log('something')
        // },
        // updateUser(state, action) {

        // }

    }, extraReducers: (builder) => {
        builder
            .addCase(registerUsers.fulfilled, (state, action) => {
                state.users.push(action.payload)
            })
            // .addCase(registerUser.pending, registerUserIdle)
            .addCase(loginUsers.fulfilled, (state, action) => {
                // we test against db
                state.users.push(action.payload)
                state.username = action.payload
                state.password = action.payload
                // state.users.map((userdata) => {
                //     userdata === action.payload ? state.users.push(userdata) : state.loading = 'error'
                // })
            })
    }
});

// export const registerUserIdle = (state, action) => {return {...state, loading: 'loading'}}

// const getUserFromDB = (registerUser.pending)
// deleteUser, updateUser
export const { submitUser, getUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)