
import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { REACT_APP_EXPRESS_URL } from '@env'

const uri = `${REACT_APP_EXPRESS_URL}`

export const registerUsers = createAsyncThunk(`/register`, async (thunkApi, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${uri}/register`, thunkApi)
        return response.data
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})

export const loginUsers = createAsyncThunk(`/login`, async (thunkApi, { rejectWithValue, signal }) => {
    // do not show creds in console
    try {
        const response = await axios.post(`${uri}/login`, thunkApi)
        return response.data
    }
    catch (error) {
        rejectWithValue(error.response.data)
    }
})

export const pushVersesToDatabase = createAsyncThunk('/verse', async (thunkApi, { rejectWithValue }) => {
    try {
        console.log(thunkApi)
        const response = await axios.post(`${uri}/verse`, thunkApi)
        return response.data
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})

export const removeVerseFromDatabase = createAsyncThunk('/verse/delete', async (thunkApi, { rejectWithValue }) => {
    console.log(thunkApi)
    try {
        const response = await axios.post(`${uri}/verse/delete`, thunkApi)
        return response.data
    } catch (error) {
        rejectWithValue(error.response.data)
    }
})
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

// createSlice uses immer library internally
export const authSlice = createSlice({
    name: 'authenticate',
    initialState: {
        users: [],
        username: null, //guest... No highlight if guest.
        email: null,
        token: null,
        loading: 'idle',
        isLoggedIn: false, //only bool right now
        currentRequestId: null,
        errorMessage: null,
        highlightedVerses: []
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
                window.location.reload()
                // do not want window location so it will do this for all three devices. useEffect dependency to fire a function
                // window.location.reload() //crashes on android for some reason. need a reload function that will work on all of the devices. if i reload on ios or android on re-rendeer of app, i am logged out though...
            }
        },
        putVerseInDatabase(state, action) {
            console.log(state)
            console.log(action)
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUsers.fulfilled, (state, action) => {
                const { currentRequestId } = action.meta
                console.log(state.loading)
                console.log(action)
                if (state.loading === 'pending' && state.currentRequestId === action.meta.requestId) {
                    state.loading = 'idle'
                }
            })

            .addCase(registerUsers.pending, (state, action) => {
                console.log(state.loading)
                console.log(action)
                state.loading = "pending"
                state.currentRequestId = action.meta.requestId
            })

            .addCase(registerUsers.rejected, (state, action) => {
                state.errorMessage = action.error
                state.loading = "rejected"
            })

            .addCase(loginUsers.fulfilled, (state, action) => {
                const { requestId, signal } = action.meta
                console.log(signal)
                console.log(requestId)

                state.errorMessage = null
                state.username = action.payload.username
                state.token = action.payload.token
                state.loading = 'success'
                state.isLoggedIn = true
                state.highlightedVerses = action.payload.highlightedVerses

            })

            .addCase(loginUsers.pending, (state, action) => {
                const currentRequestId = action.meta.requestId
                if (action.type === '/login/pending' && action.meta.requestId !== currentRequestId) {
                    state.currentRequestId = action.meta.requestId
                    state.loading = "pending"
                }
                if (!state.isLoggedIn && state.currentRequestId !== action.meta.requestId) {
                    state.currentRequestId = undefined
                    state.loading = 'rejected'
                }
            })

            .addCase(loginUsers.rejected, (state, action) => {
                state.loading = "idle"
                state.errorMessage = action.error
            })

            .addCase(pushVersesToDatabase.pending, (state, action) => {
                if (action.type === '/verse/pending') {
                    console.log(state)
                    console.log(action)
                }
            })

            .addCase(pushVersesToDatabase.fulfilled, (state, action) => {
                if (action.type === '/verse/fulfilled') {
                    console.log(state)
                    console.log(action)
                    state.highlightedVerses.push(action.meta.arg) //well i do just want to push one single verse or if it is selected take it off if clicked.
                }
            })
            // send action meta arg to db
            .addCase(removeVerseFromDatabase.pending, (state, action) => {
                if (action.type === '/verse/delete/pending') {
                    state.highlightedVerses.forEach((element) => {
                        if (element.verse === action.meta.arg.verse && element.book === action.meta.arg.book && element.chapter === action.meta.arg.chapter && element.version === action.meta.arg.version) {
                            delete element.verse, element.book, element.chapter, element.version //this ,may be problematic because it would be deleting all
                        }
                        // its just deleting all element.verse... i dont think it even looks at action.meta.arg.verse... same for version, book, chapter, username
                    })

                }
            })
            .addCase(removeVerseFromDatabase.fulfilled, (state, action) => {
                console.log(state)
                console.log(action)
            })
    }
});

function logoutRefresh() {
    this.forceUpdate()
}



const putUserInDatabase = (state, action) => { return { username: action.payload.username } }
export const { submitUser, logoutUser, putVerseInDatabase } = authSlice.actions

export default authSlice.reducer

export const selectUser = (state, userId) => state.authenticate.users.find(user => user.userId === userId)