import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import store from '../app/store'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { loginUsers, submitUser, logoutUser } from '../features/auth/authSlice'
import { unwrapResult } from '@reduxjs/toolkit'

// import { test, expect } from 'jest'
// This should be retreive
// builder.addMatcher?
const Login = ({ navigation }) => {

    // per the ref docs, i should consider state when using the useRef to clear input text
    // const inputRef = React.useRef()

    // const ClearInput = () => {
    //     return (

    //         inputRef.current.value = ""
    //     )
    // }
    // const OnFocus = () => {
    //     inputRef.current.focus()
    // }

    // const InputFunction = () => {
    //     return (

    //     <View>
    //         <TextInput ref={inputRef} onFocus={OnFocus} onChangeText={setUsername} placeholder='Enter your Username'/>
    //         {/* <TextInput ref={inputRef} onChangeText={setPassword} placeholder='Enter your Password'/> */}
    //     </View>
    //     )
    // }
    console.log(store.getState())
    const getUserFromDatabase = submitUser();

    const user = useSelector((state, action) => state.authenticate);
    console.log(user.loading)
    // const [username, setUsername] = React.useState(state => state.authenticate.username);
    // const [password, setPassword] = React.useState(state => state.authenticate.password);

    // inside of function. no nested hooks
    const dispatch = useDispatch()

    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const onSubmitUser = async () => {
        try {
            const resultAction = await dispatch(
                loginUsers({
                    username,
                    password,
                })
            )
            setUsername('')
            setPassword('')
            console.log(resultAction)
            const unwrappedResultAction = unwrapResult(resultAction)
            console.log(unwrappedResultAction.username)
            console.log(resultAction.type === '/login/fulfilled')
            // if (resultAction.type === '/login/fulfilled') {
            //     if(state.loading === 'pending' && resultAction.meta.requestId)
            // }
            //but still. Even a bad user is fulfilled...
            // console.log(resultAction.type === '/login/fulfilled') //but still. Even a bad user is fulfilled...
            console.log(resultAction.type === '/login/rejected') //the redux docs said to handle with the result action... or i could anyways
            // if (resultAction.type === '/login/rejected') {
            //     resultAction.abort()
            // }
            console.log(resultAction.type === '/login/pending')
            console.log(user.username)
            if (resultAction.type === '/login/pending') {
                // I have no idea
                dispatch(getUserFromDatabase) // if the result back from this is username: null password: null, then reject. otherwise, process...

                // {user.token === null && user.loading === 'pending' 
                // ?'Fetching user'
                // :user.username !== null
                // // user.username
                // ?`Logged in as ${user.username}`
                // : 'Could not find the user in db'
                // }
                // : user.username !== null //i would have update this instead of authenticatedUsers. Something I looked at suggested that an object may be easier
            }
            // if (username === null && password === null) {
            //     console.log("Could not find the user")
            // }
        }
        // if (result.type = '/login/fulfilled') { 
        //     const fulfilledResult = unwrapResult(result)
        //     console.log(fulfilledResult)
        // }

        catch (error) {
            console.log(error)
        }
        setUsername('')
        setPassword('')

    }

    React.useEffect(() => {
        // result.type
        if (user.loading === 'success') {
            const stateBefore = store.getState()
            console.log(stateBefore)
            // dispatch(getUserFromDatabase) //i think this should go in pending
            // console.log(result)
            const stateAfter = store.getState()
            console.log(stateAfter)
        }
        // I have to switch the status to failed in auth slice
        if (user.loading === 'failed') {
            console.log("Failed")
            console.log(store.getState())

        }
        if (user.loading === 'loading') {
            console.log("Pending")
            console.log(store.getState())
        }
        if (user.loading === 'pending') {
            // dispatch(getUserFromDatabase)
        }
    }, [dispatch, user.loading])

    return (
        <View style={{ alignItems: 'center', padding: 5 }}>

            {!user.isLoggedIn && user.loading !== 'success' &&
                <View>

                    {/* <MaterialCommunityIcons name='login' size={100} /> */}

                    <TextInput style={styles.inputStyles} placeholder='Enter your username' onChangeText={setUsername} />
                    <TextInput style={styles.inputStyles} placeholder='Enter your password' onChangeText={setPassword} />
                    <Pressable style={styles.buttonStyles} onPress={onSubmitUser}>
                        <Text>Submit</Text>
                    </Pressable>
                    {/* <Pressable style={styles.buttonStyles} onPress={dispatch(loginUsers({username: 'set state to guest', password: 'not needed'}))}>
                       <Text>Continue as Guest</Text>
                   </Pressable> */}
                </View>

            }
            {!user.isLoggedIn && user.loading === 'failed' &&
                <View>
                    <Text>Could not find the user</Text>
                </View>
            }


            {/* I would really rather take login off when i login */}
            {user.token !== null &&
                <View>
                    <Text>{user.username} is logged in</Text>
                    <Pressable onPress={() => navigation.navigate({ name: 'Home' })} >
                        <Text>Go Back</Text>
                    </Pressable>
                    {/* <Pressable onPress={() => AsyncStorage.removeItem('access-token')} >
                        <Text>Logout</Text>
                    </Pressable> */}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputStyles: {
        height: 50,
        width: '80%',
        borderColor: 'black'
    },
    buttonStyles: {
        height: 50,
        width: 100,
        backgroundColor: 'green',
    }
})

export default Login
