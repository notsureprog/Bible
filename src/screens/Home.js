import React from 'react'
import { View, Text, Pressable } from 'react-native'

function Home({ navigation }) {
    
    
    return (
        <View>
            <Pressable onPress={() => { navigation.navigate('BibleSelectScreen') }}>
                <Text>Click Here to Read the Bible on my fancy Home Page.</Text>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('BibleSearchVerseScreen') }}>
                <Text>Search for a verse</Text>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('Login') }}>
                <Text>Login</Text>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('Register') }}>
                <Text>Register</Text>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate('Test') }}>
                <Text>Test</Text>
            </Pressable>
        </View>
    )
}

export default Home
