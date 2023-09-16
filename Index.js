import React from 'react'
import App from './App'
import { Provider } from 'react-redux'
import store from './src/app/store'
// import { configureStore } from '@reduxjs/toolkit'

// export default configureStore({
//     reducer: {}
// })

// i am kind of thinking react dom render may be causing the issue
const Index = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

export default Index