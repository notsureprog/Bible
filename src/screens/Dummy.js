import React from 'react'
import { View, Text } from 'react-native'
import axios from 'axios'

// console.log(process);

function Dummy() {
    const GetMiddleWare = async () => {
        try {
            const options = {
                method: 'GET',
                url: `http://localhost:3000/Home`,
                headers: {
                    'Content-Type': 'text/plain',
                    // 'Access-Control-Allow-Origin': 'http://localhost:19006/Dummy'
                }
            }
            const result = await axios(options);
            console.log(result.data);
        } catch (err) {
            console.log(err)
        }
    }
    React.useEffect(() => {
        GetMiddleWare()
    },[])
    return (
        <View>
            <Text>{process.env.REACT_APP_API_KEY}</Text>
        </View>
    )
}

export default Dummy
