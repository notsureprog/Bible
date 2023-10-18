import React from 'react'
import { View, Text, Pressable } from 'react-native'
import UserDropDown from '../../components/UserDropDown'
import { loginUsers, logoutUser } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
function Home({ navigation }) {
    const user = useSelector((state) => state.authenticate)
    const dispatch = useDispatch()

    return (
        <View>
            {user.reducer.isLoggedIn &&
                <View>
                    <UserDropDown />
                    <Pressable onPress={() => { navigation.navigate('BibleSelectScreen') }}>
                        <Text>Click Here to Read the Bible on my fancy Home Page.</Text>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('BibleSearchVerseScreen') }}>
                        <Text>Search for a verse</Text>
                    </Pressable>
                    <Pressable onPress={() => dispatch(logoutUser())}>
                        <Text>Logout</Text>
                    </Pressable>
                </View>
            }
            {!user.reducer.isLoggedIn &&
                <View>

                    <Pressable onPress={() => { navigation.navigate('Login') }}>
                        <Text>Login</Text>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('Register') }}>
                        <Text>Register</Text>
                    </Pressable>
                </View>
            }

        </View>
    )
}

export default Home
