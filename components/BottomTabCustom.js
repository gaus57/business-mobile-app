import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import BottomTabItem from './BottomTabItem';

const BottomTabCustom = ({ state, descriptors, navigation, pushItem = null }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const tabBarIcon = options.tabBarIcon;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <BottomTabItem
            key={index}
            focused={isFocused}
            label={label}
            icon={tabBarIcon}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}

      {pushItem}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    borderTopWidth: .5,
    borderColor: 'rgba(0,0,0,.2)',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default BottomTabCustom
