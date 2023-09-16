import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import server from '../../../database/server';
// createAsyncThunk will deal with the backend

const register = createAsyncThunk('auth/register', async (user, thunkApi) => {
    try {
        // return await authService
        return await server.register(user);
    } catch(err) {
        console.log(err) //for now.
        return thunkApi.rejectWithValue(message);
    }
});
export const authSlice = createSlice({
    name: 'authenticate',
    // array. do not mutate directly, so this is safe
    initialState: [{
        username: null,
        password: null
    }],
    reducers: {
        
        submitUser(state, action){
            state.push(action.payload)
        },
        logout: state => {
            state.username = false,
                state.password = false
        },
        isLoggedIn: (state, action) => {
            
            state.username = action.payload.username,
                state.password = action.payload.password

        }
    }, extraReducers: (builder) => {
        // builder
        // addCase1
        // addCase2, etc... read after work
    }
})

export const { submitUser, logout, isLoggedIn } = authSlice.actions

export default authSlice.reducer