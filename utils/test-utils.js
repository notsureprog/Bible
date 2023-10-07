import React from 'react'
import store from '../src/app/store'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'

const AllProviders = ({children}) => {
    return (
        <Provider store={store}>{children}</Provider>
    )
}
 const renderWithProviders = (ui, options) => {
    // theme, but not atm... I could put the theme  in redux, but idk
    render(ui, {wrapper: AllProviders, ...options})
}

export default renderWithProviders
    // No clue lol


