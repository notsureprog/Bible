// // import { loginUser } from './authSlice'
import React from 'react'
import {View, Text} from 'react-native'
// import LoginMock from '../__mocks__/LoginMock'
import {expect} from '@jest/globals'
import { AllProviders, renderWithProviders } from '../utils/test-utils'
import {jest} from '@jest/globals'
import store from '../src/app/store'
import Login from '../src/screens/Login'



// test('should return the initial state', () => {
//     renderWithProviders(Login)
// })

// const Something = () => {
//     return "Yes"
// }



test('Username is null', () => {
    // renderWithProviders
    const setState = jest.fn()
    jest.spyOn(React, 'useState')
    .mockImplementationOnce(initState => [initState, setState])
    // console.log(setState)
    console.log("RenderWithProvider")
    const res = renderWithProviders(<Login />, setState) //ui, options
    console.log("End Render With Propvider")
    expect(res.authenticate.username).toBe(null)
})


