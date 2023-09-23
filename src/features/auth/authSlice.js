// import { useRoute } from '@react-navigation/native';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
// import { useReducer } from 'react';
// const uri = 'https://jsonplaceholder.typicode.com/posts';
const uri = `http://localhost:3000`
// createAsyncThunk will deal with the backend
// accepts a Redux action type string (/api/users) and a call back fn 
// when the api responds back to middleware it is pending, fulfilled, or rejected
export const registerUsers = createAsyncThunk(`/api/register`, async (thunkApi) => {
    console.log(thunkApi)
    // on idle the dispatch will run through the thunk, try to post or get from the uri
    try {
        // returns a promise
        const response = await axios.get(`${uri}/api/register/${thunkApi.username}/${thunkApi.password}/${thunkApi.confirmPassword}/${thunkApi.email}`, {
            validateStatus: (status) => {
                return status < 500
            },
            proxy: {
                protocol: 'http',
                host: '127.0.0.1/api/register',
                port: 3000
            }
            
        })
        // console.log(userId.username === response.data.userId)
        // console.log(response.data.map(res => res.userId))
        console.log(response.data)
        // console.log(userId.username === res.userId)
        return response.data
    } catch (err) {
        if (err.response) {
            console.log('data error')
            console.log(err.response.data)
            console.log('end data error')
            console.log('status error')
            console.log(err.response.status)
            console.log('end status error')
            console.log('header error')
            console.log(err.response.headers)
            console.log('end header error')
        } else if (err.request) {
            console.log('request error')
            console.log(err.request)
            console.log('end request error')
        } else {
            console.log('Error', err.message)
        }
        return err.message
    }
})

export const loginUsers = createAsyncThunk(`/api/login`, async(thunkApi) => {
    const options = {
        method: 'GET',
        url: `http://localhost:3000/api/login/${thunkApi.username}/${thunkApi.password}`
    }
    try {
        const response = await axios(options)
        return response.data
    } catch(err) {
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
        loading: 'idle'
    },

    reducers: {
        submitUser(state, action) {
            console.log(action.payload)
            state.users.push(action.payload)
        },

        getUser(state, action) {
            state.username = action.payload
            state.password = action.payload
        }

    }, extraReducers: (builder) => {
        builder
        .addCase(registerUsers.fulfilled, (state, action) => {
            state.users.push(action.payload)
        })
        // .addCase(registerUser.pending, registerUserIdle)
        .addCase(loginUsers.fulfilled, (state, action) => {
            // we test against db
            state.users.push(action.payload)
            // state.users.map((userdata) => {
            //     userdata === action.payload ? state.users.push(userdata) : state.loading = 'error'
            // })
        })
    }
});

// export const registerUserIdle = (state, action) => {return {...state, loading: 'loading'}}

// const getUserFromDB = (registerUser.pending)

export const { submitUser, getUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)