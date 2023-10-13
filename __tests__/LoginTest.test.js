// // import { loginUser } from './authSlice'
import React from 'react'
import { View, Text, Pressable } from 'react-native'
import Login from '../src/screens/Login'
// import DummyComponent from '../components/DummyComponent'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useDispatch, useSelector } from 'react-redux'
// import userEvent from "@testing-library/user-event";
// i was wondering about usedispatch and useselector earlier
// import userEvent from "@testing-library/user-event"; -- for like click events and stuff...
// import LoginMock from '../__mocks__/LoginMock'
import { expect, test } from '@jest/globals'
import { jest } from '@jest/globals'
import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react-native'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { renderWithProviders } from '../utils/test-utils'


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
                username: state.username = 'notsure'
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



test('I Guess Reducer Test lol :)', async () => {
    const store = mockStore(initialState)

    const onPressMock = jest.fn()

    console.log("GETTING A USER")
    console.log(store.getState())
    store.dispatch({ type: 'SUBMIT_USER' }) //line 75 comes from here, and not the reducer
    console.log(store.getState())
    const receivedPayload = store.getActions()
    console.log(store.getActions()) //[{type: 'SUBMIT_USER'}]
    expect(store.getActions()).toBe(receivedPayload)
    console.log("END GETTING A USER")

})

test('I want the store to update', async () => {
    const reactRedux = { useDispatch, useSelector }
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch')
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector')
    // Ok. So we already have a mock store configured with the reducer
    const store = mockStore(initialState)
    console.log(store)
    const mockDispatch = jest.fn(); //maybe this is the key
    useDispatchMock.mockReturnValue(mockDispatch)
    store.dispatch = mockDispatch
    renderWithProviders(
        // I have to use Login...or I should
        <Login />
    )
    const submitUserButton = screen.getByText('Submit')
    console.log(submitUserButton)
    // expect(submitUserButton).toBeInTheDocument()
    // store contains some functions getState, getactions, etc....

})



