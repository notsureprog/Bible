import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

function Home({ navigation }) {
    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate('BibleSelectScreen') }}>
                <Text>Bible</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home
