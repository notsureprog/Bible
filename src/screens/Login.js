import React from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import store from '../app/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { submitUser, loginUsers } from '../features/auth/authSlice'

// This should be retreive
// builder.addMatcher?
const Login = () => {
    console.log(store.getState())
    const getUserFromDatabase = submitUser();
    const user = useSelector((state) => state.authenticate);
    // const [username, setUsername] = React.useState(state => state.authenticate.username);
    // const [password, setPassword] = React.useState(state => state.authenticate.password);

    // inside of function. no nested hooks
    const dispatch = useDispatch()

    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    // console.log(uname)
    // console.log(pword)

    const onSubmitUser = () => {

        dispatch(
            loginUsers({
                // __id: 'mongodb', -- automatically generated on a register.
                username,
                password,
            })
        )
        setUsername('')
        setPassword('')

    }

    React.useEffect(() => {
        if (user.loading === 'success') {
            dispatch(getUserFromDatabase())
        }
    }, [dispatch, user.loading])

    // const credintials = { lusername, lpassword };
    // console.log(credintials);

    return (
        <View>
            <TextInput placeholder='Enter your username' onChangeText={setUsername} />
            <TextInput placeholder='Enter your password' onChangeText={setPassword} />
            <Pressable onPress={onSubmitUser}>
                <Text>submit</Text>
            </Pressable>
        </View>
    )
}

export default Login
