import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ReportScreen from '../screens/ReportScreen';


const Stack = createStackNavigator();
export default function ReportsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Report" component={ReportScreen} options={{title: 'Отчет'}} />
    </Stack.Navigator>
  )
}
