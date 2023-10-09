import React from 'react'
import { View, Text, Pressable } from 'react-native'
import store from "../src/app/store";
import DropDownPicker from 'react-native-dropdown-picker';
import { logoutUser } from '../src/features/auth/authSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import useJwt from '../hooks/useJwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UserDropDown = () => {
    const token = useJwt('access-token')
    const dispatch = useDispatch()
    const user = useSelector((state) => state.authenticate)

    
    // ui kitten
    // drop down picker
    // more
    // https://harithsenevi4.medium.com/top-4-react-native-dropdown-components-2023-631dd1d0f0e9
    return (
        <View>
            {useJwt() !== null &&
                <View>
                    {/* getting ahead of myself */}
                    <Text>{user.username + "'s Menu"}</Text>
                    {/* <DropDownPicker
                    placeholder='Logout'
                    onPress={dispatch(logoutUser())}
                    /> */}
                </View>
            }
            {useJwt() === null &&
                <Text>Sign in</Text>
            }
        </View>
    )
}

export default UserDropDown