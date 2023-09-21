import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
// import GetDatabase from '../../../database/server'
// mongodb uri somehow...
const uri = 'https://jsonplaceholder.typicode.com/posts';
// createAsyncThunk will deal with the backend
export const putUser = createAsyncThunk('/api/register', async () => {
    // on idle the dispatch will run through the thunk, try to post or get from the uri
    try {
        const response = await axios.get(uri)
        return [...response.data]
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
        loading: 'idle',
        
    },
    
    reducers: {

        submitUser(state, action) {
            state.users.push(action.payload)
        },

        getUser(state, action) {
            state.username = action.payload
            state.password = action.payload
        }

        
        // The recommended way of using extraReducers is to use a callback and (thunk or createAction) that receives a ActionReducerMapBuilder instance.
    }, extraReducers: (builder) => {
        builder
        
            .addCase(putUser.pending, getAllUsers)
            .addCase(putUser.fulfilled, userReceived)
            .addCase(putUser.rejected, getUserFailed)
        // builder.addCase()
        // addCase1
        // addCase2, etc... read after work
    }
})


export const userReceived = (state, action) => {
    state.loading = 'success'
    
    
}

export const getAllUsers = (state, action) => {return state.loading = 'loading'}
export const getUserFailed = (state, action) => {return state.loading = 'failed'}
// export const getAllPassword = (state) => state.authenticate.password
// export const getAllEmail = (state) => state.authenticate.email
export const getLoadingStatus = (state) => state.loading

export const { submitUser, getUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state, username) => state.authenticate.users.find(user => user.username === username)