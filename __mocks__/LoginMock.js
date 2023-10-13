const { jest } = require("@jest/globals");
import configureStore from 'redux-mock-store'
import { View, Text } from 'react-native'
// this may be good in a separate store file
const middlewares = [];
const mockStore = configureStore(middlewares)
let state = {
    authenticate: {
        // just to make it identical
        users: [],
        currentRequestedId: null,
        username: null,
        password: null,
        isLoggedIn: false,
        token: null,
        isLoading: 'idle',
        authenticatedUser: {}
    }
}





export const store = mockStore(() => state.authenticate)
