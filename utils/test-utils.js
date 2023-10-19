import React from 'react'
import { store } from '../__mocks__/LoginMock'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'

export const AllProviders = ({ children }) => {
    return (
        <Provider store={store}>{children}</Provider>
    )
}

export const renderWithProviders = (ui, options) => {
    return render(ui, { wrapper: AllProviders, ...options })
}

export * from '@testing-library/react-native'
export { render }