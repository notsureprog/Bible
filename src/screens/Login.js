import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import store from '../app/store'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { loginUsers, submitUser, logoutUser } from '../features/auth/authSlice'
import { unwrapResult } from '@reduxjs/toolkit'

// console.log(store) //not even used. However, it should be state from user...
// import { test, expect } from 'jest'
// This should be retreive
// builder.addMatcher?
const Login = ({ navigation }) => {
    

    const getUserFromDatabase = submitUser();
    const user = useSelector((state, action) => state.authenticate);
    console.log(user)
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
            console.log(resultAction)
            const unwrappedResultAction = unwrapResult(resultAction)
            console.log(unwrappedResultAction)
            console.log(resultAction.type === '/login/fulfilled')
            console.log(resultAction.type === '/login/rejected') //the redux docs said to handle with the result action... or i could anyways
            console.log(resultAction.type === '/login/pending')
            console.log(resultAction.type === '/login/loading')
            setUsername('')
            setPassword('')
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
            const stateAfter = store.getState()
            console.log(stateAfter)
        }
        if (user.loading === 'failed') {
            console.log("Failed")
            console.log(store.getState())
        }
        if (user.loading === 'loading') {
            console.log("loading")
            console.log(store.getState())
        }
        if (user.loading === 'pending') {
            console.log(store.getState())
            dispatch(getUserFromDatabase)
        }
    }, [dispatch, user.loading])

    return (
        <View style={{ alignItems: 'center', padding: 5 }}>
            {!user.isLoggedIn && user.loading !== 'success' &&
                <View>
                    {/* <MaterialCommunityIcons name='login' size={100} /> */}
                    <TextInput testID='username' style={styles.inputStyles} placeholder='Enter your username' onChangeText={setUsername} />
                    <TextInput testID='password' style={styles.inputStyles} placeholder='Enter your password' onChangeText={setPassword} />
                    <Pressable testID='submit' style={styles.buttonStyles} onPress={onSubmitUser}>
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
                    <Text testID='printed-username'>{user.username} is logged in</Text>
                    <Pressable onPress={() => navigation.navigate({ name: 'Home' })} >
                        <Text>Go Back</Text>
                    </Pressable>
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
