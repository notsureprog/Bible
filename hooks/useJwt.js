import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { user_detail } from '../controllers/authController'

const useJwt = async (name) => {
// no dispatch
    // const [token, setToken] = React.useState(userToken)
    try {
// maybe a useEffect rather than memo with a dependency of dispatch (for logout dispatch) or just state.token since it changes on removeitem
// AsyncStorage.removeItem
        const token = await AsyncStorage.getItem(name)
        console.log(token)
        if (token) {
            return token
        } else {
            const token = null
            return token
        }
    } catch (err) {
        console.log(err)
    }
}

export default useJwt