// // import { loginUser } from './authSlice'
import React from 'react'
import { View, Text } from 'react-native'
import Login from '../src/screens/Login'

// import LoginMock from '../__mocks__/LoginMock'
import { expect, test } from '@jest/globals'
import { jest } from '@jest/globals'
import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react-native'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { renderWithProviders } from '../utils/test-utils'
import { store } from '../__mocks__/LoginMock'

let initialState = {
    authenticate: {
        // just to make it identical
        users: [],
        currentRequestedId: null,
        username: null,
        password: null,
        isLoggedIn: false,
        token: null,
        authenticatedUser: {}
    }
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SUBMIT_USER":
            return {
                ...state,
                username: state.authenticate.username = 'notsure'
            }
        case "REMOVE_USER":
            return {
                ...state,
                username: state.authenticate.username = null
            }
    }
    return state
}
const middlewares = [];
const mockStore = configureStore({reducer: authReducer})



test('I Guess Reducer Test lol :)', async () => {
    const store = mockStore(initialState.authenticate)
    
    const onPressMock = jest.fn()


    console.log("GETTING A USER")
    console.log(store.getState())
    store.dispatch({type: 'SUBMIT_USER'}) //line 75 comes from here, and not the reducer
    console.log(store.getState())
    const receivedPayload = store.getActions()
    console.log(store.getActions()) //[{type: 'SUBMIT_USER'}]
    expect(store.getActions()).toBe(receivedPayload)
    console.log("END GETTING A USER")

})

test('I want the store to update', () => {
    const store = mockStore(() => initialState)
    store.dispatch({type: 'SUBMIT_USER'})
    console.log(store.getState())
})



