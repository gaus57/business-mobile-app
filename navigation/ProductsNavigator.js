import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsListScreen from "../screens/ProductsListScreen";
import ProductCreateScreen from "../screens/ProductCreateScreen";
import ProductEditScreen from "../screens/ProductEditScreen";
import ProductScreen from "../screens/ProductScreen"
import TabBarIcon from "../components/TabBarIcon";
import BottomTabCustom from '../components/BottomTabCustom';
import BottomTabRemoveProduct from '../components/BottomTabRemoveProduct';

const BottomTab = createBottomTabNavigator();
function ProductBottomTabNavigator({ route }) {
  const {id} = route.params;
  return (
    <BottomTab.Navigator
      initialRouteName='Product'
      tabBar={props => <BottomTabCustom {...props} pushItem={
        <BottomTabRemoveProduct route={route} />
      }/>}
    >
      <BottomTab.Screen
        name="Product"
        component={ProductScreen}
        initialParams={{ id }}
        options={{
          title: 'Товар',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-eye" />,
        }} />
      <BottomTab.Screen
        name="ProductEdit"
        component={ProductEditScreen}
        initialParams={{ id }}
        options={{
          title: 'Изменить',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-create" />
        }} />
    </BottomTab.Navigator>
  )
}

const Stack = createStackNavigator();
export default function ProductsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductsList" component={ProductsListScreen} options={{title: 'Товары'}} />
      <Stack.Screen name="ProductCreate" component={ProductCreateScreen} options={{title: 'Новый товар'}} />
      <Stack.Screen name="Product" component={ProductBottomTabNavigator} options={({route}) => ({title: 'Товар №'+route.params.id})} />
    </Stack.Navigator>
  )
}
