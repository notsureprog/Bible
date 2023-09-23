// import { useRoute } from '@react-navigation/native';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
// import { useReducer } from 'react';
// const uri = 'https://jsonplaceholder.typicode.com/posts';
const uri = `http://localhost:3000/api/register`
// createAsyncThunk will deal with the backend
// accepts a Redux action type string (/api/users) and a call back fn 
// when the api responds back to middleware it is pending, fulfilled, or rejected
export const putUser = createAsyncThunk(`/`, async (thunkApi) => {
    console.log(thunkApi)
    // on idle the dispatch will run through the thunk, try to post or get from the uri
    try {
        // returns a promise
        const response = await axios.get(`${uri}/${thunkApi.username}/${thunkApi.password}/${thunkApi.email}`, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
            
        })
        // console.log(userId.username === response.data.userId)
        // console.log(response.data.map(res => res.userId))
        console.log(response.data)
        // console.log(userId.username === res.userId)
        return response.data
    } catch (err) {
        return err.message
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
        .addCase(putUser.fulfilled, (state, action) => {
            state.users.push(action.payload)
        })
    }
});

// const getUserFromDB = (putUser.pending)

export const { submitUser, getUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)