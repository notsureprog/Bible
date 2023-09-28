import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { submitUser, registerUsers } from '../features/auth/authSlice'
import { ThemeContext } from './context/ThemeContext'

const Register = () => {
    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode

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
        if (password === confirmPassword) {
            dispatch(
                registerUsers({
                    // regex will take care of email and all the other stuff
                    username,
                    password,
                    confirmPassword,
                    email
                })
            )
        } else {
            <Text>Passwords do not match</Text>
        }
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

// const styles = {}
    return (
        // ugly
        <View style={{ height: '100%', alignItems: 'center', padding: 5, justifyContent: 'space-between', backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Username</Text>
            <TextInput style={{color: darkMode ? styles.dark.color : styles.light.color,borderWidth: 2,  fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10}}  onChangeText={setUsername} />
            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Email</Text>
            <TextInput style={{color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setEmail} />
            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Password</Text>
            <TextInput style={{color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setPassword} />
            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Confirm Password</Text>
            <TextInput style={{color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setConfirmPassword} />

            <Pressable style={styles.buttonStyles} onPress={registerUser}>
                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 40, fontWeight: '900', fontFamily: 'serif', borderRadius: 5 }}>Submit</Text>
            </Pressable>
        </View>
    )
}

// doing this because it is kind of difficult to use on the phone.
const styles = StyleSheet.create({
    textStyles: {
        fontSize: 60,
        fontFamily: 'sans-serif',
        fontWeight: '700'
    },
    textInputStyles: {
        height: 50,
        width: '75%',
        borderWidth: 2,
        // color: darkMode ? styles.dark.color : styles.light.color,
        // borderColor: darkMode ? styles.dark.color : styles.light.color
    },
    // borderColor: darkMode ? darkMode.dark.color : dar
    dark: {
        backgroundColor: '#000000',
        color: '#ffffff',

        // borderWidth: 1
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000',

        // borderWidth: 1
    },
    buttonStyles: {
        backgroundColor: 'green',
        height: 50,
        width: '100%',
        alignItems: 'center',
        borderRadius: 10
        // margin: '50%'
    }
})

export default Register
