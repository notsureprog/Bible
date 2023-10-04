import authReducer, {loginUsers} from './authSlice'
import {test, expect} from '@jest/globals'

test('should return the initial state', () => {
    expect(authReducer(undefined, {type: undefined})).toEqual({
        username: null, completed: false
    })
})

// test('a user not logged in is null')
// test('this thunk should always be skipped', async() => {
//     const thunk = createAsyncThunk('/login', async() => throw new Error('This promise should never be entered'), {
//         condition: () => false,
// })
//     const result = await thunk()(dispatch, getState, null)

//     expect(result.meta.condition).toBe(true)
//     expect(result.meta.aborted).toBe(false)
// })