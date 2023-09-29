import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import store from '../app/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux'
import { getUser, loginUsers, submitUser } from '../features/auth/authSlice'

// This should be retreive
// builder.addMatcher?
const Login = () => {
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
         if(user.loading === 'failed') {
            console.log(store.getState())
         }
    }, [dispatch, user.loading])

    // const credintials = { lusername, lpassword };
    // console.log(credintials);

    return (
        <View style={{alignItems: 'center', padding: 5}}>
            

             <MaterialCommunityIcons name='login' size={100} />
            <TextInput style={styles.inputStyles} placeholder='Enter your username' onChangeText={setUsername} />
            <TextInput style={styles.inputStyles} placeholder='Enter your password' onChangeText={setPassword} />
            <Pressable style={styles.buttonStyles} onPress={onSubmitUser}>
                <Text>Submit</Text>
            </Pressable>
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
