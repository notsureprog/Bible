import React from 'react'
import { View, Text, Pressable } from 'react-native'
import _ from 'underscore'
import UserDropDown from '../../components/UserDropDown'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { loginUsers, logoutUser } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
function Home({ navigation }) {
    const user = useSelector((state) => state.authenticate.reducer, _.isEqual)
    const dispatch = useDispatch()
    // think about this after sleep...
    // React.useEffect(() => {
        
    // },[user.isLoggedIn])

    return (
        <View>
            {user.isLoggedIn &&
                <View>
                    <UserDropDown />
                    <Pressable onPress={() => { navigation.navigate('BibleSelectScreen') }}>
                        <Text>Read the Bible</Text>
                        <MaterialCommunityIcons name='book' size={100} />
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('BibleSearchVerseScreen') }}>
                        <MaterialCommunityIcons name='magnify' size={100} />
                    </Pressable>
                    <Pressable onPress={() => dispatch(logoutUser())}>
                        <MaterialCommunityIcons name='logout' size={100} />
                    </Pressable>
                </View>
            }
            {!user.isLoggedIn &&
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
