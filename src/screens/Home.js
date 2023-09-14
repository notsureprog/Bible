import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
// import {Ngrok} from 'ngrok'
// import { NgrokClient } from 'ngrok'

// console.log(NgrokClient)

function Home({ navigation }) {
    console.log(process.env.EXPO_PUBLIC_API_URL)
    // const [loading, setLoading] = React.useState(false);
    // if (loading) {
    //     const GetNgrok = async () => {
    //         try {

    //             const options = {
    //                 method: 'GET',
    //                 url: 'http://localhost:3000/Home',
    //                 headers: {
    //                     'Access-Control-Allow-Origin': 'http://localhost:3000'
    //                 }
    //             }
    //             const result = axios(options)
    //             console.log(result)
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    // }
    // React.useEffect(() => {
    //     GetNgrok()
    // }, [])
    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate('BibleSelectScreen') }}>
                <Text>Click Here to Read the Bible on my fancy Home Page.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('BibleSearchVerseScreen') }}>
                <Text>Search for a verse</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Home
