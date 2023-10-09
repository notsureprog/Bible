// import { StatusBar } from 'expo-status-bar';
import React from 'react'
import store from './src/app/store'
import { Provider } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BibleSelectScreen from './src/screens/BibleSelectScreen'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import BibleScreen from './src/screens/BibleScreen'
import { ThemeProvider } from './src/screens/context/ThemeContext'
// import { ThemeContext } from './src/screens/context/ThemeContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BibleSearchVerseScreen from './src/screens/BibleSearchVerseScreen'
import ThemeButton from './components/ThemeButton'
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import ErrorPage from './src/screens/ErrorPage'


console.log("On the app.js")
console.log(store.getState())
console.log("End on the app.js")
// 64a594186127bbd1c9dba6e9f71d58f6
// import {BibleSelectScreen} from './src/screens/BibleSelectScreen'


const Stack = createNativeStackNavigator();


const App = () => {
 
const linking = {
  prefixes: ['Bible://']
}
  // I would not mind exporting a function and placing app inside and putting it in the provider 
  return (

    <ThemeProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='BibleSelectScreen' component={BibleSelectScreen} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
          <Stack.Screen name='BibleScreen' component={BibleScreen} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
          <Stack.Screen name='BibleSearchVerseScreen' component={BibleSearchVerseScreen} options={{ headerTitle: 'Search the Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
          <Stack.Screen name='Home' component={Home} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
          {/* {!state.authenticate.isLoggedIn && } */}
          <Stack.Screen name='Login' component={Login} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
          <Stack.Screen name='Register' component={Register} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
          <Stack.Screen name='Error' component={ErrorPage}/>
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



