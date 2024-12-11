import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListeGuichets from './screens/ListeGuichets';
import AjouterGuichet from './screens/AjouterGuichets';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListeGuichets">
          <Stack.Screen name="ListeGuichets" component={ListeGuichets} />
          <Stack.Screen name="AjouterGuichet" component={AjouterGuichet} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;

