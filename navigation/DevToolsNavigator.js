import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import DevToolsScreen from '../screens/DevToolsScreen';


const Stack = createStackNavigator();
export default function DevToolsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DevTools" component={DevToolsScreen} options={{title: 'Инструменты разработчика'}} />
    </Stack.Navigator>
  )
}
