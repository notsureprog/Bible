import React from 'react'
import { View, Text, Pressable } from 'react-native'
import _ from 'underscore'
import UserDropDown from '../../components/UserDropDown'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { loginUsers, logoutUser } from '../features/auth/authSlice'
// import { useWindowDimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
function Home({ navigation }) {
    const user = useSelector((state) => state.authenticate.reducer, _.isEqual)
    const dispatch = useDispatch()
    console.log("Home Page")
    // think about this after sleep...
    // React.useEffect(() => {
        // function to login and logout somewhere...
    // },[user.isLoggedIn])

    return (
        <View>
            {/* android hates flex for styling... */}
            {user.isLoggedIn &&
                <View >
                    <UserDropDown />
                    <Pressable onPress={() => { navigation.navigate('BibleSelectScreen') }}>
                        <MaterialCommunityIcons style={{marginLeft: '33%', marginBottom: '15%'}} name='book' size={100} />
                        {/* <Text>Click here to read the Bible. Also included is the A;ocrypha</Text> */}
                    </Pressable>
                    <Pressable onPress={() => { navigation.navigate('BibleSearchVerseScreen') }}>
                        <MaterialCommunityIcons style={{marginLeft: '33%', marginBottom: '15%'}} name='magnify' size={100} />
                    </Pressable>
                    <Pressable onPress={() => dispatch(logoutUser())}>
                        <MaterialCommunityIcons style={{marginLeft: '33%', marginBottom: '15%'}} name='logout' size={100} />
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
