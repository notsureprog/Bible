import React from 'react'
import {View, Text, Pressable} from 'react-native'
import { useSelector } from 'react-redux'
const ErrorPage = ({navigation}) => {
  const user = useSelector((state) => state.authenticate)
  return (
    <View>
      {/* I kind if want an error page lol. I will keep this... */}
        <Text>Something Went Wrong</Text>
        <Pressable onPress={() => console.log("Trying again")}>
          <Text>Try Again</Text>
        </Pressable>
    </View>
  )
}

export default ErrorPage
