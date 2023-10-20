// // import { loginUser } from './authSlice'
import React from 'react'
import Login from '../src/screens/Login'
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

// fix user.reducer.loading is undefined error
const ReduxWrapper = ({ children }) => {
    <Provider store={store}>{children}</Provider>
}

beforeEach(() => {
    const user = initialState
})

test('I Guess Reducer Test lol :)', async () => {
    rtlRender(<Login />, { wrapper: ReduxWrapper })
    try {
        const result = await screen.findByTestId("form")
        console.log(result)
    } catch (error) {
        console.log(error)
    }

    // expect(result).getByText("Submit")
    // console.log(result)
})

// test('I want the store to update', async () => {


//     const reactRedux = { useDispatch, useSelector }
//     const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch')
//     const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
//     const mockDispatch = jest.fn(); //maybe this is the key
//     useDispatchMock.mockReturnValue(mockDispatch)
//     store.dispatch = mockDispatch
//     const loginMock = jest.createMockFromModule('../src/screens/Login')
// })


