import authReducer, { submitUser } from '../features/auth/authSlice'
import verseReducer from '../features/verse/bookSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import AsyncStorage from '@react-native-async-storage/async-storage'
console.log(authReducer)
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    
}

// const getDefaultMiddleware = () => {
    

// }

const reducers = combineReducers({
    // change to authReducer
    reducer: authReducer, // i dont think the persist is the problem... I think I need to clearr the localStorage a little better... rather than persist:root
    verseReducer: verseReducer
    // themeReducer: themeReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)
const store =  configureStore({
    reducer: {authenticate: persistedReducer},
    middleware: [thunk, logger]
})
    
export default store
export const persistor = persistStore(store)

