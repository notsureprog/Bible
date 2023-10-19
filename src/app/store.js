import authReducer, { submitUser } from '../features/auth/authSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
console.log(authReducer)
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    
}

const reducers = combineReducers({
    reducer: 
         authReducer
})
const persistedReducer = persistReducer(persistConfig, reducers)
const store =  configureStore({
    reducer: {authenticate: persistedReducer}
})
    
export default store
export const persistor = persistStore(store)
