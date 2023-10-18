// // import { loginUser } from './authSlice'
import React from 'react'
import { View, Text, Pressable } from 'react-native'
import Login from '../src/screens/Login'
// import DummyComponent from '../components/DummyComponent'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useDispatch, useSelector } from 'react-redux'
import { expect, test } from '@jest/globals'
import { jest } from '@jest/globals'
import { cleanup, fireEvent, render as rtlRender, screen, userEvent } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { renderWithProviders } from '../utils/test-utils'
import DummyComponent from '../components/DummyComponent'


let initialState = {
    users: [],
    username: null,
    email: null,
    token: null,
    loading: 'idle',
    isLoggedIn: false,
    authenticatedUser: {},
    currentRequestId: null

}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        // resultaction.type
        case "/login/fulfilled":
            return {
                ...state,
                username: state.username = 'notsure',
                loading: state.loading = 'success'
            }
        case "REMOVE_USER":
            return {
                ...state,
                username: state.username = null
            }
    }
    return state
}

const middlewares = [];
const mockStore = configureStore({ reducer: authReducer })

const store = mockStore(initialState)

beforeEach(() => {
    const user = initialState

})

test('I Guess Reducer Test lol :)', async () => {

    rtlRender(<Provider store={store}><Login /></Provider>)
    // const user = screen.getByTestId('username')
    // expect(user).toBe(null)
    // const usernameVal = screen.getByPlaceholderText('username')
    // expect(usernameVal).toBeDefined()
    // // const RealComponent = jest.requireActual('Text')
    // const onPressMock = jest.fn()

    // console.log("GETTING A USER")
    // console.log(store.getState())
    // store.dispatch({ type: 'SUBMIT_USER' }) //line 75 comes from here, and not the reducer
    // console.log(store.getState())
    // const receivedPayload = store.getActions()
    // console.log(store.getActions()) //[{type: 'SUBMIT_USER'}]
    // expect(store.getActions()).toBe(receivedPayload)
    // console.log("END GETTING A USER")

})

test('I want the store to update', async () => {


    const reactRedux = { useDispatch, useSelector }
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch')
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
    // Ok. So we already have a mock store configured with the reducer
    
    
    const mockDispatch = jest.fn(); //maybe this is the key

    useDispatchMock.mockReturnValue(mockDispatch)
    store.dispatch = mockDispatch
    const loginMock = jest.createMockFromModule('../src/screens/Login')

})

// const utils = jest.createMockFromModule('../utils/utils').default
// expect(utils.isAuthorized('not wizard').toEqual(true))

// test('implementation created by jest createMockFromModule', () => {
//     expect(utils.authorize.mock).toBeTruthy()
//     expect(utils.isAuthorized('not wizard')).toEqual(true)
// })


