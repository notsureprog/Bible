import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../src/features/auth/authSlice';

const UserDropDown = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.authenticate.reducer)

    // const HandleUser = () => {
    //     return (
    //         <View>
    //             {user.isLoggedIn &&
    //                 <Pressable onPress={() => dispatch(logoutUser())}>
    //                     <Text>Logout</Text>
    //                 </Pressable>
    //             }
    //         </View>
    //     )
    // }

    
    return (
        <View>
            {user.token !== null &&
                <View>
                    {/* <HandleUser /> */}
                    <Text>{user.username + "'s Menu"}</Text>

                </View>
            }
            {user.token === null &&
                <Text>Sign in</Text>
            }
        </View>
    )
    


    

    // ui kitten
    // drop down picker
    // more
    // https://harithsenevi4.medium.com/top-4-react-native-dropdown-components-2023-631dd1d0f0e9

}

export default UserDropDown