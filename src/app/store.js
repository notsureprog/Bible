import authReducer, { submitUser } from '../features/auth/authSlice'
import verseReducer from '../features/verse/verseSlice'
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
    reducer: authReducer,
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

