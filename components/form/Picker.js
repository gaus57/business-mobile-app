import * as React from 'react';
import {StyleSheet, Picker as ReactPicker, Text, View} from 'react-native';

const Picker = ({label, items = [], value, error, onChange}) => {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.pickerLabel}>{label}</Text>
      <ReactPicker
        selectedValue={value}
        onValueChange={onChange}>
        {items.map(item => <ReactPicker.Item key={item[0]} label={item[1]} value={item[0]} />)}
      </ReactPicker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 20,
    borderStyle: 'solid',
    borderBottomColor: '#aaa',
    borderBottomWidth: 2,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a98aa',
  },
});

export default Picker;
