import renderWithProviders from "../../../utils/test-utils"
import Login from "../../screens/Login"
import {test} from ''

test('should return the initial state', () => {
    renderWithProviders(Login)
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