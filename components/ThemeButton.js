import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { ThemeContext } from '../src/screens/context/ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const ThemeButton = () => {
    const theme = React.useContext(ThemeContext);
    console.log(theme)
    const darkMode = theme.state.darkMode;

    const onClick = () => {
        if (darkMode) {
            theme.dispatch({ type: "LIGHTMODE" })
        }
        else {
            theme.dispatch({ type: "DARKMODE" })
        }
    }

    return (
        <View>
            <Pressable onPress={() => onClick()}>
                <MaterialCommunityIcons name="theme-light-dark" style={{ marginTop: 5, color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#000000',
        color: '#ffffff',

        // borderWidth: 1
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    main: {
        flex: 3
    }
})

export default ThemeButton
