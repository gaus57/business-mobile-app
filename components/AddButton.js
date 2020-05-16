import * as React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import {Ionicons} from '@expo/vector-icons';

const AddButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons
        name='md-add'
        size={50}
      />
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
    backgroundColor: Colors.addBtnColor,
    borderRadius: 40,
    opacity: .8,
  },
  text: {
    fontSize: 50,
  },
});

export default AddButton
