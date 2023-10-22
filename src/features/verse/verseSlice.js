// need to toggle on or off the verse highlighted.
import React from 'react'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { REACT_APP_EXPRESS_URL } from '@env'

export const putVerse = createAsyncThunk('/verse', async (thunkApi) => {
    try {

        const options = {
            url: `${REACT_APP_EXPRESS_URL}/verse`
        }
        const result = await axios.post(options, thunkApi)
        console.log(result.data)
        return result.data
    } catch (error) {
        console.log(error)
    }
})

export const verseSlice = createSlice({
    name: 'verse',
    initialState: {
        // this will be persisted
        highlightedVerses: []
    },
    reducers: {
        selectVerse(state, action) {
            if (action.type === '/verse/selectVerse') {
                console.log("I got hit")

                state.highlightedVerses.push(action.payload) //or something like that
            }
        }
    },
    // extraReducers (builder) {
    //     builder
    //     .addCase(selectVerse.fulfilled, (state, action) => {

    //     })
    // } 

})

export const { selectVerse } = verseSlice.actions

export default verseSlice.reducer
