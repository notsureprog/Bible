
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import http from 'http'
import { Platform } from 'react-native'
// import { store, persistor } from '../../app/store'
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

export const loginUsers = createAsyncThunk(`/login`, async (thunkApi, { rejectWithValue, signal }) => {

    try {
        console.log(thunkApi)
        const response = await axios.post(`${uri}/login`, thunkApi)
        return response.data
    }
    catch (err) {
        console.log(err.name)
        // if (err.name === 'AbortError') {}
        rejectWithValue(err.response.data)
    }
},
    // FORCE CANCELLATION ON EVEN GOOD REQUESTS
    // test commented out...
    //  {
    // //     // Canceling Before Execution... No wonder...
    // // // unreachable thunkApi
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
        loading: 'idle', //should neveer be undefined. 
        isLoggedIn: false, //only bool right now
        // authenticatedUser: {},
        currentRequestId: null,
        errorMessage: null
    },

    reducers: {
        submitUser(state, action) {
            console.log(current(state))
            state.users.push(action.payload)
            console.log(current(state))
        },
        logoutUser(state, action) {
            console.log(action.type)
            if (action.type === 'authenticate/logoutUser') {
                AsyncStorage.removeItem('persist:root')
                window.location.reload() //crashes on android for some reason. need a reload function that will work on all of the devices. if i reload on ios or android on re-rendeer of app, i am logged out though...
            }
        }
    },

    extraReducers: (builder) => {
        builder
            // register user cases
            .addCase(registerUsers.fulfilled, (state, action) => {
                console.log(state.loading)
                console.log(action)
                // for the register, I would not really need to update the global state.
            })

            .addCase(registerUsers.pending, (state, action) => {
                console.log(state.loading)
                console.log(action)
                state.loading = "pending"
            })

            .addCase(registerUsers.rejected, (state, action) => {
                state.errorMessage = action.error
                state.loading = "rejected"
            })

            .addCase(loginUsers.fulfilled, (state, action) => {
                const { requestId, signal } = action.meta
                console.log(signal)
                console.log(requestId)
                state.username = action.payload.username
                state.token = action.payload.token
                state.loading = 'success'
                state.isLoggedIn = true
            })

            .addCase(loginUsers.pending, (state, action) => {
                const currentRequestId = action.meta.requestId
                console.log(currentRequestId)
                if (action.type === '/login/pending' && action.meta.requestId !== currentRequestId) {
                    // signal.abort()
                    state.currentRequestId = action.meta.requestId
                    state.loading = "pending" // I need this tested and handled iin the pending. because the thunk completes with rejected or fulfilled
                    // the user will or will not be in the db...
                    console.log(state.isLoggedIn)
                }
                if (!state.isLoggedIn && state.currentRequestId !== action.meta.requestId) {
                    state.currentRequestId = undefined
                    state.loading = 'rejected'
                    console.log(action)
                }
            })

            .addCase(loginUsers.rejected, (state, action) => {
                state.loading = "idle"
                state.errorMessage = action.error
                
                // i do need to refresh the store on submit if i get rejected.
            })
    }
});

function logoutRefresh() {
    this.forceUpdate()
}
// export const registerUserIdle = (state, action) => {return {...state, loading: 'loading'}}
const putUserInDatabase = (state, action) => { return { username: action.payload.username } }
// const getUserFromDB = (registerUser.pending)
// deleteUser, updateUser

export const { submitUser, logoutUser } = authSlice.actions

export default authSlice.reducer
// not needed i do not believe
export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)