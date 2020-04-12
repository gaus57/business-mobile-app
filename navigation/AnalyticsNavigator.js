import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Analytics1Screen from "../screens/Analytics1Screen";
import Analytics2Screen from "../screens/Analytics2Screen";
import Analytics3Screen from "../screens/Analytics3Screen";
import TabBarIcon from '../components/TabBarIcon';
import BottomTabCustom from '../components/BottomTabCustom';

const Analytics1Stack = createStackNavigator();
function Analytics1Navigator() {
  return (
    <Analytics1Stack.Navigator>
      <Analytics1Stack.Screen name="Analytics1" component={Analytics1Screen} options={{title: 'Прибыль'}} />
    </Analytics1Stack.Navigator>
  )
}

const Analytics2Stack = createStackNavigator();
function Analytics2Navigator() {
  return (
    <Analytics2Stack.Navigator>
      <Analytics2Stack.Screen name="Analytics2" component={Analytics2Screen} options={{title: 'Структура'}} />
    </Analytics2Stack.Navigator>
  )
}

const Analytics3Stack = createStackNavigator();
function Analytics3Navigator() {
  return (
    <Analytics3Stack.Navigator>
      <Analytics3Stack.Screen name="Analytics3" component={Analytics3Screen} options={{title: 'Товары'}} />
    </Analytics3Stack.Navigator>
  )
}

const BottomTab = createBottomTabNavigator();
export default function AnalyticsNavigator() {
  return (
    <BottomTab.Navigator tabBar={props => <BottomTabCustom {...props} />}>
      <BottomTab.Screen name="Analytics1" component={Analytics1Navigator} options={{
        title: 'Прибыль',
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-trending-up" />,
      }} />
      <BottomTab.Screen name="Analytics2" component={Analytics2Navigator} options={{
        title: 'Структура',
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-pie" />,
      }} />
      <BottomTab.Screen name="Analytics3" component={Analytics3Navigator} options={{
        title: 'Товары',
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-stats" />,
      }} />
    </BottomTab.Navigator>
  )
}
