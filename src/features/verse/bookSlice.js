// need to toggle on or off the verse highlighted.
import React from 'react'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { REACT_APP_EXPRESS_URL } from '@env'
// import { putVerseInDatabase } from '../../../database/db'


export const putVerse = createAsyncThunk('/verse', async (thunkApi) => {
    try {
        const options = {
            url: `${REACT_APP_EXPRESS_URL}/verse`
        }
        const result = await axios.post(`${REACT_APP_EXPRESS_URL}/verse`, thunkApi)
        console.log(result.data)
        return result.data
    } catch (error) {
        console.log(error)
    }
})

export const bookSlice = createSlice({
    name: 'books',
    // go on the intro page of every book. Like Gen.intro
    initialState: {
        // this will be persisted
        book: null, //Genesis
        author: null, //Moses
        dateCreated: null, //3000 bc?
        description: null //whatever suits it.
    },
    reducers: {
        selectVerse(state, action) {
            console.log(state)
            console.log(action.payload)
        }
    },
})

export const { showBookInformation } = bookSlice.actions

export default bookSlice.reducer
