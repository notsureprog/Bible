// import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BibleSelectScreen from './src/screens/BibleSelectScreen'
import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import BibleScreen from './src/screens/BibleScreen'
import { ThemeProvider } from './src/screens/context/ThemeContext'
import BibleSearchVerseScreen from './src/screens/BibleSearchVerseScreen'
import ThemeButton from './components/ThemeButton'
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import ErrorPage from './src/screens/ErrorPage'

const Stack = createNativeStackNavigator();

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.authenticate)
  console.log(user.reducer)
  const linking = {
    prefixes: ['Bible://']
  }
  
  return (

    <ThemeProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator initialRouteName='Home'>
          {user.reducer.isLoggedIn &&
            <Stack.Group>
              <Stack.Screen name='BibleSelectScreen' component={BibleSelectScreen} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
              <Stack.Screen name='BibleScreen' component={BibleScreen} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
              <Stack.Screen name='BibleSearchVerseScreen' component={BibleSearchVerseScreen} options={{ headerTitle: 'Search the Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
              <Stack.Screen name='Home' component={Home} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
            </Stack.Group>
          }

          {!user.reducer.isLoggedIn &&
            <Stack.Group>
              <Stack.Screen name='Login' component={Login} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
              <Stack.Screen name='Register' component={Register} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
              <Stack.Screen name='Error' component={ErrorPage} />
              <Stack.Screen name='Home' component={Home} options={{ headerTitle: 'The Bible', headerRight: () => <ThemeButton />, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'orange' } }} />
            </Stack.Group>
          }
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
  },
});

export default App



