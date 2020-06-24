import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersListScreen from "../screens/OrdersListScreen";
import OrderCreateScreen from "../screens/OrderCreateScreen";
import OrderEditScreen from "../screens/OrderEditScreen";
import OrderScreen from "../screens/OrderScreen";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import BottomTabCustom from '../components/BottomTabCustom';
import BottomTabRemoveOrder from '../components/BottomTabRemoveOrder';

const BottomTab = createBottomTabNavigator();
function OrderBottomTabNavigator({ route }) {
  const {id} = route.params;
  return (
    <BottomTab.Navigator
      initialRouteName='Order'
      tabBar={props => <BottomTabCustom {...props} pushItem={
        <BottomTabRemoveOrder route={route} />
      }/>}
    >
      <BottomTab.Screen
        name="Order"
        component={OrderScreen}
        initialParams={{ id }}
        options={{
          title: 'Продажа',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-eye" />,
        }} />
      <BottomTab.Screen
        name="OrderEdit"
        component={OrderEditScreen}
        initialParams={{ id }}
        options={{
          title: 'Изменить',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-create" />
        }} />
    </BottomTab.Navigator>
  )
}

const Stack = createStackNavigator();
export default function OrdersNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrdersList" component={OrdersListScreen} options={{title: 'Продажи'}} />
      <Stack.Screen name="OrderCreate" component={OrderCreateScreen} options={{title: 'Новая продажа'}} />
      <Stack.Screen name="Order" component={OrderBottomTabNavigator} options={({route}) => ({title: 'Продажа №'+route.params.id})} />
    </Stack.Navigator>
  )
}
