import React from 'react'
import store from '../src/app/store'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'


export const AllProviders = ({children}) => {
    return (
        <Provider store={store}>{children}</Provider>
    )
}
 export const renderWithProviders = (ui, options) => {
    // theme, but not atm... I could put the theme  in redux, but idk
    return render(ui, {wrapper: AllProviders, ...options})
    // return render(ui, {wrapper: AllProviders, ...options})
}


