import React from 'react'
import {View, Text} from 'react-native'
const ErrorPage = (props) => {
  return (
    <View>
        <Text>{props.status}</Text>
    </View>
  )
}

export default ErrorPage
