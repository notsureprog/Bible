import React from 'react'
import App from './App'
import { Provider } from 'react-redux'
// import {store, persistor} from './src/app/store'
import store, {persistor} from './src/app/store'
import { PersistGate } from 'redux-persist/integration/react'
// import { configureStore } from '@reduxjs/toolkit'

// export default configureStore({
//     reducer: {}
// })

// i am kind of thinking react dom render may be causing the issue
const Index = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    )
}

export default Index