import React from 'react'
import { View, Text, Pressable } from 'react-native'
import UserDropDown from '../../components/UserDropDown'
import { MaterialCommunityIcons } from '@expo/vector-icons'
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
                        <Text>Read the Bible</Text>
                        <MaterialCommunityIcons name='book' size={100}/>
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('BibleSearchVerseScreen') }}>
                    <MaterialCommunityIcons name='magnify' size={100}/>
                    </Pressable>
                    <Pressable onPress={() => dispatch(logoutUser())}>
                    <MaterialCommunityIcons name='logout' size={100}/>
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
