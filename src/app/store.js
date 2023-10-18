import authReducer, { submitUser } from '../features/auth/authSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
// This is the store file already created used in index.js coming from the authslice. 
import storage from 'redux-persist/lib/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import persistCombineReducers from 'redux-persist/es/persistCombineReducers'
// this is the configuration of the store
console.log(authReducer)
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    
}

// plan for scaling

const reducers = combineReducers({
    reducer: 
         authReducer
})
const persistedReducer = persistReducer(persistConfig, reducers)
const store =  configureStore({
    reducer: {authenticate: persistedReducer}
})
    // reducer: {
    //     // authenticate must match the authenticate in authslice. cannot be authenticate(d)
    //     authenticate: authReducer
    // }
    // persistedReducer


// const exampleThunkFunction = (dispatch, getState) => {
//     const before = getState() //lol
//     console.log("Username before" + before.authenticate.username)
//     dispatch(submitUser())
//     const after = getState()
//     console.log("username after" + after.authenticate.username)
// }

// store.dispatch(exampleThunkFunction)
//  const store = configureStore({
//     reducer: {

//         authenticate: authReducer,
//     },
//      middleware: (getDefaultMiddleware) => {
//          getDefaultMiddleware({
//              serializableCheck: {
//                  ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
//              }
//          })
//      }
// })
export default store

export const persistor = persistStore(store)
