import React from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { submitUser, putUser, getLoadingStatus, getAllUsers, userReceived, getUserFailed } from '../features/auth/authSlice'
// import { loadState } from './localStorage';
const Register = () => {
   
    // const test = loadState()
    // console.log(test)
    // This should be a create 
    const [username, setUsername] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [confirmPassword, setConfirmPassword] = React.useState(null);

    const users = useSelector((state) => state.authenticate.users);
    const getAllUser = useSelector(getAllUsers)
    const usersReceived = useSelector(userReceived)
    const getUsersFailed = useSelector(getUserFailed)

    React.useEffect(() => {
// the direct mutation must be here?
        if (getLoadingStatus === 'idle') {
            dispatch(putUser()) //thunk
        }
        if (getLoadingStatus === 'loading') {
            dispatch(getAllUser())
        }
        if (getLoadingStatus === 'success') {
            dispatch(usersReceived())
        }
        if (getLoadingStatus === 'failed') {
            dispatch(getUsersFailed())
        }
    },[dispatch, getLoadingStatus]) 
    // console.log(getAllUser)
    // const getAllPassword = useSelector(getAllPassword)
    // const getAllEmail = useSelector(getAllEmail)
    // const getLoadingStatus = useSelector(getLoadingStatus)

    //loading status will only change when the post fails, succeeeds, or loads

    // if succeed
    // const uname = useSelector((state) => state.authenticate.username)
    // const pword = useSelector((state) => state.authenticate.password)
    // const confirmPWord = useSelector((state) => state.authenticate.confirmPassword)
    // const emailAddress = useSelector((state) => state.authenticate.email)
    // const test = localStorage.getItem(users)
    // console.log(test)
    console.log(users)
    const dispatch = useDispatch()
    // const TestPassword = () => { }
    // schema will test password
    const registerUser = () => {
        
        // if (uname !== null && pword !== null && confirmPWord !== null && emailAddress !== null) {
        // if (password === confirmPassword) {

        dispatch(
            submitUser({
                username,
                password,
                confirmPassword,
                email
            })
        )
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setEmail('')
    }


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
