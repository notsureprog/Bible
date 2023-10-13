import React from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { submitUser, registerUsers } from '../features/auth/authSlice'
import { ThemeContext } from './context/ThemeContext'

const Register = ({ navigation }) => {
    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode
    const user = useSelector(state => state.authenticate)
    const putUserInDatabase = submitUser()
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
                    // first iteration, all of this stuff is undefined
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
        } else {
            <Text>Passwords do not match</Text>
        }

        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setEmail('')
    }

    React.useEffect(() => {
        if (user.loading === 'success') {
            dispatch(putUserInDatabase)
        }
        // if (user.loading === 'loading') {
        //     dispatch(putUsersIdle()) //problem here because idle
        // }
    }, [dispatch, user.loading])
    return (

        <View style={{ height: '100%', alignItems: 'center', padding: 5, justifyContent: 'space-between', backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
            {!user.isLoggedIn &&
                <View>

                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Username</Text>
                    <TextInput style={{ color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setUsername} />
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Email</Text>
                    <TextInput style={{ color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setEmail} />
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Password</Text>
                    <TextInput style={{ color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setPassword} />
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 30, fontWeight: '900', fontFamily: 'serif' }}>Confirm Password</Text>
                    <TextInput style={{ color: darkMode ? styles.dark.color : styles.light.color, borderWidth: 2, fontSize: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, height: 60, width: '100%', borderRadius: 10 }} onChangeText={setConfirmPassword} />

                    <Pressable style={styles.buttonStyles} onPress={registerUser}>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 40, fontWeight: '900', fontFamily: 'serif', borderRadius: 5 }}>Submit</Text>
                    </Pressable>
                </View>
            }

            {user.isLoggedIn &&
                <View>
                    <Text>{user.username} is Logged in. You will need to sign out.</Text>
                    <Pressable onPress={() => navigation.navigate({ name: 'Home' })}>
                        <Text>Go Back</Text>
                    </Pressable>
                </View>
            }
        </View>
    )
}
// cannot be used, but I am leaving for now
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
    },

    dark: {
        backgroundColor: '#000000',
        color: '#ffffff',
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    buttonStyles: {
        backgroundColor: 'green',
        height: 50,
        width: '100%',
        alignItems: 'center',
        borderRadius: 10
    }
})

export default Register
