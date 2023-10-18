import React from 'react'
import { Text, View, Pressable, TextInput } from 'react-native'
import axios from 'axios'

const DummyComponent = () => {
    const [username, setUsername] = React.useState()
    const [password, setPassword] = React.useState()

    const [uri, setUri] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const object = {
        something: { a: '1', b: '2', c: '3' },
        arr: [1, 2, 3]
    }
    const ApiCall = async () => {
        try {
            if (loading) {

                const options = {
                    method: 'GET',
                    uri: `${uri}`
                }
                const result = await axios(options)
                return result.data
            }
        } catch (error) {
            console.log(error)
        }
    }
    React.useEffect(() => {
        ApiCall()
    }, [loading])
    return (
        <View>
            <TextInput placeholder='username' onChange={(event) => setUsername(event.nativeEvent.text)} />
            <TextInput placeholder='password' onChangeText={(event) => setPassword(event.nativeEvent.text)} />
            <Pressable onPress={() => { setLoading(true); setUri('https://jsonplaceholder.typicode.com/posts{username}/{password}/blahblah') }}>
                <Text aria-label='submit'>Submit</Text>
            </Pressable>
        </View >
    )
}

export default DummyComponent
