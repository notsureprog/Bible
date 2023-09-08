// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BibleSelectScreen from './src/screens/BibleSelectScreen'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/screens/Home'
import BibleScreen from './src/screens/BibleScreen'
import Dummy from './src/screens/Dummy'
import { ThemeProvider } from './src/screens/context/ThemeContext'
import { ThemeContext } from './src/screens/context/ThemeContext'
import { useContext } from 'react'

// 64a594186127bbd1c9dba6e9f71d58f6
// import {BibleSelectScreen} from './src/screens/BibleSelectScreen'


const Stack = createNativeStackNavigator();


const App = () => {
  // const theme = useContext(ThemeContext);
  // const darkMode = theme.state.darkMode;

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='BibleSelectScreen'>
          <Stack.Screen name='BibleSelectScreen' component={BibleSelectScreen} options={{ title: 'Select your Book/Chapter' }} />
          <Stack.Screen name='BibleScreen' component={BibleScreen} />
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
});

export default App



