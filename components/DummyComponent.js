import React from 'react'
import { Text, View, Pressable } from 'react-native'
// import axios from 'axios'
const DummyComponent = () => {
    const [uri, setUri] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const ApiCall = async () => {
        try {
            const options = {
                method: 'GET',
                uri: `${uri}`
            }
            const result = await axios(options)
            return result.data
        } catch (error) {
            console.log(error)
        }
    }
    React.useEffect(() => {
        ApiCall()
    }, [loading])
    return (
        <View>
            <Text>This is a dummy component</Text>
            <Pressable onPress={() => { setLoading(true); setUri('https://jsonplaceholder.typicode.com/posts') }}>
                <Text aria-label='submit'>Submit</Text>
            </Pressable>
        </View>
    )
}

export default DummyComponent
