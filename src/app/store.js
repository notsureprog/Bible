import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

export default configureStore({

    reducer: {
        // authenticate must match the authenticate in authslice. cannot be authenticate(d)
        authenticate: authReducer
    }
})