import React from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { submitUser, registerUsers } from '../features/auth/authSlice'

const Register = () => {
    const user = useSelector(state => state.authenticate)
    const putUserInDatabase = submitUser()
    // const putUsersIdle = putUserIdle()
    // console.log(putUserIdle.state)
    console.log(user.loading)
    console.log(user.users.map(u => console.log(u)))
    const [username, setUsername] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [confirmPassword, setConfirmPassword] = React.useState(null);
    const dispatch = useDispatch()

    const registerUser = () => {
        console.log("Dispatch error")

        dispatch(
            registerUsers({
                username,
                password,
                confirmPassword,
                email
            })
        )
        console.log("Dispatch error")
        // setUsername('')
        // setPassword('')
        // setConfirmPassword('')
        // setEmail('')
    }

    React.useEffect(() => {
        if (user.loading === 'success') {
            dispatch(putUserInDatabase())
        }
        if (user.loading === 'loading') {
            dispatch(putUsersIdle()) //problem here because idle
        }
    }, [dispatch, user.loading])


    return (
        <View>
            <Text>Username:</Text>
            <TextInput onChangeText={setUsername} />
            <Text>Email</Text>
            <TextInput onChangeText={setEmail} />
            <Text>Password</Text>
            <TextInput onChangeText={setPassword} />
            <Text>Confirm Password</Text>
            <TextInput onChangeText={setConfirmPassword} />

            <Pressable onPress={registerUser}>
                <Text>Submit</Text>
            </Pressable>
        </View>
    )
}

export default Register
