import AsyncStorage from '@react-native-async-storage/async-storage'
// import { user_detail } from '../controllers/authController'

const useJwt = async (name) => {

    // const [token, setToken] = React.useState(userToken)
    try {
        const token = await AsyncStorage.getItem(name)
        console.log(token)
        return token
    } catch (err) {
        console.log(err)
    }
}

export default useJwt