import React from 'react'
import {View, Text} from 'react-native'
const ErrorPage = (props) => {
  return (
    <View>
      {/* I kind if want an error page lol. I will keep this... */}
        <Text>{props.status}</Text>
    </View>
  )
}

export default ErrorPage
