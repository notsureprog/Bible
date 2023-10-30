import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import store from '../app/store'
import _ from 'underscore'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { loginUsers, submitUser, logoutUser } from '../features/auth/authSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Login = ({ navigation }) => {

    const getUserFromDatabase = submitUser();
    const user = useSelector((state, action) => state.authenticate.reducer, _.isEqual); 
    console.log(user)
    const dispatch = useDispatch()
    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [loading, setLoading] = React.useState(false)

    const onSubmitUser = async () => {

        try {
            // abortsignal here and listener in thunk?
            const resultAction = await dispatch(
                loginUsers({
                    username,
                    password,
                })
            )
            setUsername('')
            setPassword('')
            setLoading(false)
            console.log(resultAction.type)
        } catch (error) {
            console.log(error)
        }

    }

    React.useEffect(() => {
        if (user.loading === 'success') {
            const stateBefore = store.getState()
            console.log(stateBefore)
            const stateAfter = store.getState()
            console.log(stateAfter)
        }
        if (user.loading === 'rejected') {
            console.log("Failed")
            console.log("Denied Access")
            console.log(store.getState())
        }
        if (user.loading === 'loading') {
            console.log("loading")
            console.log(store.getState())
            dispatch(getUserFromDatabase)
        }
        if (user.loading === 'pending') {
            console.log(store.getState())
        }
        if (user.loading === 'idle') {
            console.log(store.getState())
        }
    }, [dispatch, user.loading])

    // https://meliorence.github.io/react-native-render-html/api/renderhtml
    return (
        <View aria-label='main' style={{ alignItems: 'center', padding: 5 }}>
            
            {!user.isLoggedIn && user.loading !== 'success' &&
                <View>
                    <TextInput testID='usernam' style={styles.inputStyles} placeholder='Enter your username' onChangeText={setUsername} />
                    <TextInput aria-aria-label='password' style={styles.inputStyles} placeholder='Enter your password' onChangeText={setPassword} />
                    <Pressable accessibilityRole='button' style={styles.buttonStyles} onPress={onSubmitUser}>
                        <Text>Submit</Text>
                    </Pressable>
                    
                </View>
            }
            {!user.isLoggedIn && user.username !== null &&
                <View testID='nouser'>
                    <Text>Could not find the user</Text>
                </View>
            }
            {user.token !== null &&
                <View>
                    <Text>{user.username} is logged in</Text>
                    <Pressable onPress={() => navigation.navigate('Home')} >
                        <Text>Go Back</Text>
                    </Pressable>
                    <Pressable onPress={() => dispatch(logoutUser({ type: 'authenticate/logoutUser' }))} >
                        <Text>Logout</Text>
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
