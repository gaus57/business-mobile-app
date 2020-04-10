import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CostsListScreen from "../screens/CostsListScreen";
import CostCreateScreen from "../screens/CostCreateScreen";
import CostEditScreen from "../screens/CostEditScreen";
import CostScreen from "../screens/CostScreen";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import BottomTabCustom from '../components/BottomTabCustom';
import BottomTabRemoveCost from '../components/BottomTabRemoveCost';

const BottomTab = createBottomTabNavigator();
function CostBottomTabNavigator({ route }) {
  const {id} = route.params;
  return (
    <BottomTab.Navigator
      initialRouteName='Cost'
      tabBar={props => <BottomTabCustom {...props} pushItem={
        <BottomTabRemoveCost route={route} />
      }/>}
    >
      <BottomTab.Screen
        name="Cost"
        component={CostScreen}
        initialParams={{ id }}
        options={{
          title: 'Расход',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-eye" />,
        }} />
      <BottomTab.Screen
        name="CostEdit"
        component={CostEditScreen}
        initialParams={{ id }}
        options={{
          title: 'Изменить',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-create" />
        }} />
    </BottomTab.Navigator>
  )
}

const Stack = createStackNavigator();
export default function CostsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CostsList" component={CostsListScreen} options={{title: 'Расходы'}} />
      <Stack.Screen name="CostCreate" component={CostCreateScreen} options={{title: 'Новый расход'}} />
      <Stack.Screen name="Cost" component={CostBottomTabNavigator} options={({route}) => ({title: 'Расход №'+route.params.id})} />
    </Stack.Navigator>
  )
}
