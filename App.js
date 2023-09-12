// import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BibleSelectScreen from './src/screens/BibleSelectScreen'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import BibleScreen from './src/screens/BibleScreen'
import Dummy from './src/screens/Dummy'
import { ThemeProvider } from './src/screens/context/ThemeContext'
// import { ThemeContext } from './src/screens/context/ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BibleSearchVerseScreen from './src/screens/BibleSearchVerseScreen'


// 64a594186127bbd1c9dba6e9f71d58f6
// import {BibleSelectScreen} from './src/screens/BibleSelectScreen'


const Stack = createNativeStackNavigator();


const App = () => {
  // const onClick = () => {
  //   if (darkMode) {
  //     theme.dispatch({ type: "LIGHTMODE" })
  //   }
  //   else {
  //     theme.dispatch({ type: "DARKMODE" })
  //   }
  // }
  // const theme = React.useContext(ThemeContext);
  // const darkMode = theme.state.darkMode;
  // const theme = useContext(ThemeContext);
  // const darkMode = theme.state.darkMode;

  // I would not mind exporting a function and placing app inside and putting it in the provider 
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='BibleSelectScreen' component={BibleSelectScreen} options={{ title: 'Select your Book/Chapter' }} />
          <Stack.Screen name='BibleScreen' component={BibleScreen} />
          <Stack.Screen name='BibleSearchVerseScreen' component={BibleSearchVerseScreen} />
          <Stack.Screen name='Dummy' component={Dummy} />
          <Stack.Screen name='Home' component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dark: {
    backgroundColor: '#000000',
    color: '#ffffff',

    // borderWidth: 1
  },
  light: {
    backgroundColor: '#ffffff',
    color: '#000000',

    // borderWidth: 1
  },
});

export default App



