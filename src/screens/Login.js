import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import store from '../app/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { getUser, loginUsers, submitUser, logoutUser } from '../features/auth/authSlice'

// This should be retreive
// builder.addMatcher?
const Login = ({navigation}) => {
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

    const user = useSelector((state) => state.authenticate);
    console.log(user.loading)
    // const [username, setUsername] = React.useState(state => state.authenticate.username);
    // const [password, setPassword] = React.useState(state => state.authenticate.password);

    // inside of function. no nested hooks
    const dispatch = useDispatch()

    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    // console.log(uname)
    // console.log(pword)
    console.log("User Is Logged In")
    console.log(user.isLoggedIn)
    console.log("End User Is Logged In")

    const onSubmitUser = () => {

        dispatch(
            loginUsers({
                username,
                password,
            })
        )
        setUsername('')
        setPassword('')

    }

    React.useEffect(() => {
        if (user.loading === 'success') {
            const stateBefore = store.getState()
            console.log(stateBefore)
            dispatch(getUserFromDatabase())
            const stateAfter = store.getState()
            console.log(stateAfter)
        }
        if (user.loading === 'failed') {
            console.log(store.getState())
        }
    }, [dispatch, user.loading])

    // const credintials = { lusername, lpassword };
    // console.log(credintials);

    return (
        <View style={{ alignItems: 'center', padding: 5 }}>

            {!user.isLoggedIn && 
            <View>

                <MaterialCommunityIcons name='login' size={100} />
    
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

{/* I would really rather take login off when i login */}
            {user.isLoggedIn && 
            <View>
                <Text>{user.authenticatedUser.username} is logged in</Text>
                <Pressable onPress={() => navigation.navigate({name: 'Home'})} >
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
