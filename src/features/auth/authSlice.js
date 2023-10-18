
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import http from 'http'
import { Platform } from 'react-native'
import { REACT_APP_EXPRESS_URL } from '@env'

const uri = Platform.OS === 'web' ? 'http://localhost:3000' : `${REACT_APP_EXPRESS_URL}`

export const registerUsers = createAsyncThunk(`/register`, async (thunkApi) => {
    console.log(typeof (thunkApi))
    try {
        const response = axios.post(`${uri}/register`, thunkApi)
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const loginUsers = createAsyncThunk(`/login`, async (thunkApi, { rejectWithValue }) => {
    
    try {
        console.log(thunkApi)
        const response = await axios.post(`${uri}/login`, thunkApi)
        // await AsyncStorage.setItem('access-token', response.data.token)
        // await AsyncStorage.setItem('username', response.data.username)
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
    // there is an initial state. Which Is kind of needed.
    initialState: {
        users: [],
        username: null, //guest
        email: null,
        token: null,
        loading: 'idle', //should neveer be undefined. 
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
            // state.token = AsyncStorage.removeItem('access-token')
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
                console.log(state.loading)
                // const {requestId} = action.meta
                // console.log(data)
                // if (state.loading === 'pending' && requestId === currentRequestId) {

                //     console.log(action.payload)
                // }
                // state.authenticate = action.payload.body.username

            })
            .addCase(registerUsers.pending, (state, action) => {
                console.log(state.loading)
                // getUserFromDb
                // action.payload = "Submitting User. Please Wait...???" //I think that is how this works.
                state.loading = 'pending'
                state.isLoggedIn = false
                state.token = null

            })
            .addCase(registerUsers.rejected, (state, action) => {
                console.log("Denied Access")
            })
            // this is an action creator. name tells me it creates an action for the resultAction to perform (set state or whatever)
            
            .addCase(loginUsers.fulfilled, (state, action) => {
                const { requestId } = action.meta
                console.log(requestId)
                console.log(state.loading)
                console.log(state.currentRequestId)
                
                state.username = action.payload.username
                state.token = action.payload.token
                state.loading = 'success'
                state.isLoggedIn = true


            })
            .addCase(loginUsers.pending, (state, action) => {
                const currentRequestId = action.meta.requestId
                console.log(currentRequestId)
                console.log(state.loading)
                // if (state.loading === 'idle') {
                //     state.loading === 'loading'
                //     console.log(state.loading)
                //     state.currentRequestId = action.meta.requestId
                // }
                // if(state.loading === 'loading') {
                //     state.currentRequestId === undefined
                //     state.isLoggedIn = false
                //     state.loading = 'pending'
                // }
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