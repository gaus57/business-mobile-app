import * as React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

const AddButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    display:'none',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    width: 70,
    bottom: 30,
    right: 30,
    backgroundColor: '#aaa',
    borderRadius: 40,
    opacity: .6,
  },
  text: {
    fontSize: 50,
  },
});

export default AddButton
