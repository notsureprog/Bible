import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';

const UserDropDown = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.authenticate.reducer)

    // ui kitten
    // drop down picker
    // more
    // https://harithsenevi4.medium.com/top-4-react-native-dropdown-components-2023-631dd1d0f0e9
    return (
        <View>
            {user.token !== null &&
                <View>
                    <Text>{user.username + "'s Menu"}</Text>
                </View>
            }
            {user.token === null &&
                <Text>Sign in</Text>
            }
        </View>
    )
}

export default UserDropDown