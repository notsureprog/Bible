import React from 'react'
import { View, Text, Pressable } from 'react-native'
import store from "../src/app/store";
import DropDownPicker from 'react-native-dropdown-picker';


const UserDropDown = () => {
    // ui kitten
    // drop down picker
    // more
    // https://harithsenevi4.medium.com/top-4-react-native-dropdown-components-2023-631dd1d0f0e9
    return (
        <View>
            <Text>{store.authenticatedUser.username+"'s Menu"}</Text>
            <DropDownPicker 
            
            />
        </View>
    )
}

export default UserDropDown