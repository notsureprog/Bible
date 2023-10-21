import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import store from '../app/store'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { loginUsers, submitUser, logoutUser } from '../features/auth/authSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = ({ navigation }) => {

    const getUserFromDatabase = submitUser();
    // I honestly think this entire store is undefinee somehow on the first iteration.
    const user = useSelector((state, action) => state.authenticate); //idle initially but is undefined on test...
    console.log(user.reducer)
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

        //     if (resultAction.type === '/login/pending') {
        //         const unwrappedResultAction = unwrapResult(resultAction)
        //         console.log(unwrappedResultAction)
        //         console.log(resultAction)
        //         console.log("user being submitted has entered this block in Login")
        //         console.log(user.reducer.loading)
        //         if(resultAction.type === 'idle') {
        //             console.log("Thunk Dispatched and made the pending")
        //         }
        //     }
        //     console.log(resultAction.type === '/login/fulfilled')
        //     // this is an action... so it needs to do some mutating
        //     if (resultAction.type === '/login/fulfilled') {
        //         console.log(user.reducer.loading)
        //         // if(resultAction.type === 'idle' ) {
        //         //     console.log("Switch to loading")
        //         // }
        //     }
        //     // this is the actiion creator 
        //     if (resultAction.type === '/login/rejected') {
        //         console.log("Denued access")
        //     }
        //     if (resultAction.type === '/login/loading') {
        //         console.log(user.reducer.loading)
        //     }
        //     console.log(resultAction.type === '/login/rejected') //the redux docs said to handle with the result action... or i could anyways
        //     console.log(resultAction.type === '/login/pending')
        //     console.log(resultAction.type === '/login/loading')
        // }
        // catch (error) {
        //     console.log(error)
        // }

        // if (result.type = '/login/fulfilled') { 
        //     const fulfilledResult = unwrapResult(result)
        //     console.log(fulfilledResult)
        // }

    }

    React.useEffect(() => {
        // result.type
        if (user.reducer.loading === 'success') {
            const stateBefore = store.getState()
            console.log(stateBefore)
            const stateAfter = store.getState()
            console.log(stateAfter)
        }
        // on the second iteration (bad user) of submitting a user, I am going to be at user.reducer.loading === 'rejected' I want to be idle
        if (user.reducer.loading === 'rejected') {
            console.log("Failed")
            console.log("Denied Access")
            console.log(store.getState())
        }
        if (user.reducer.loading === 'loading') {
            console.log("loading")
            console.log(store.getState())
            dispatch(getUserFromDatabase)
        }
        if (user.reducer.loading === 'pending') {
            // when it is pending, the dispatch is already in progress. when it is pending, it comes back true or false of logged in or not.
            console.log(store.getState())

        }
        if (user.reducer.loading === 'idle') {
            console.log(store.getState())
        }
        // AsyncStorage.setItem('store', user)
    }, [dispatch, user.reducer.loading])

    return (
        <View aria-label='main' style={{ alignItems: 'center', padding: 5 }}>
            
            {!user.reducer.isLoggedIn && user.reducer.loading !== 'success' &&
                <View>
                    {/* <MaterialCommunityIcons name='login' size={100} /> */}
                    <TextInput testID='usernam' style={styles.inputStyles} placeholder='Enter your username' onChangeText={setUsername} />
                    <TextInput aria-aria-label='password' style={styles.inputStyles} placeholder='Enter your password' onChangeText={setPassword} />
                    {/* Following the React Redux Docs to troubleshoot... When Dispatched, the thunk will dispatch the pending action */}
                    <Pressable accessibilityRole='button' style={styles.buttonStyles} onPress={onSubmitUser}>
                        <Text>Submit</Text>
                    </Pressable>
                    {/* <Pressable style={styles.buttonStyles} onPress={dispatch(loginUsers({username: 'set state to guest', password: 'not needed'}))}>
                       <Text>Continue as Guest</Text>
                   </Pressable> */}
                </View>
            }
            {!user.reducer.isLoggedIn && user.reducer.loading === 'rejected' &&
                <View testID='nouser'>
                    <Text>Could not find the user</Text>
                </View>
            }
            {user.reducer.token !== null &&
                <View>
                    <Text>{user.reducer.username} is logged in</Text>
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
