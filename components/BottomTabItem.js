import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';

const BottomTabItem = ({label, icon = null, accessibilityLabel, testID = null, focused, onPress, onLongPress}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityStates={focused ? ['selected'] : []}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}
    >
      {icon && icon({focused})}

      <Text style={{ fontSize: 12, color: focused ? Colors.tabIconSelected : Colors.tabIconDefault }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default BottomTabItem
