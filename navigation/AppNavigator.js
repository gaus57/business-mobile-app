import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen'
import OrdersNavigator from './OrdersNavigator'
import ProductsNavigator from './ProductsNavigator'
import CostsNavigator from './CostsNavigator'
import AnalyticsNavigator from './AnalyticsNavigator'
import DevToolsNavigator from './DevToolsNavigator';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} options={{title: 'Главная'}} />
        <Drawer.Screen name="Orders" component={OrdersNavigator} options={{title: 'Продажы'}} />
        <Drawer.Screen name="Products" component={ProductsNavigator} options={{title: 'Товары'}} />
        <Drawer.Screen name="Costs" component={CostsNavigator} options={{title: 'Расходы'}} />
        <Drawer.Screen name="Analytics" component={AnalyticsNavigator} options={{title: 'Аналитика'}} />
        <Drawer.Screen name="DevTools" component={DevToolsNavigator} options={{title: 'Инструменты разработчика'}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
