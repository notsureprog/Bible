import React from 'react'
import {Text, View} from 'react-native'

export const HtmlToReact = (props) => {
    if (props.data.type === 'p') {
        return <Text className={props.data.props.className}></Text>
    }
    if (props.data.type === 'span') {
        return <View className={props.data.props.className}></View>
    }
    return (
        <Text>Hi</Text>
    )
}