import { configureStore } from '@reduxjs/toolkit'
import authReducer, { submitUser } from '../features/auth/authSlice'
// This is the store file already created used in index.js coming from the authslice. 

// this is the configuration of the store
const store =  configureStore({

    reducer: {
        // authenticate must match the authenticate in authslice. cannot be authenticate(d)
        authenticate: authReducer
    }
})

const exampleThunkFunction = (dispatch, getState) => {
    const before = getState() //lol
    console.log("Username before" + before.authenticate.username)
    dispatch(submitUser())
    const after = getState()
    console.log("username after" + after.authenticate.username)
}

store.dispatch(exampleThunkFunction)
export default store