import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements'

const InputNumber = ({label, value, error, onChange, rightIcon}) => {
  return (
    <Input
      keyboardType={'numeric'}
      value={''+value}
      label={label}
      errorMessage={error}
      inputStyle={styles.input}
      labelStyle={styles.inputLabel}
      rightIcon={rightIcon}
      onChangeText={(val) => {
        onChange(val.replace(/[^\d.]/g, ''))
      }}
    />
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    marginTop: 20,
  },
  input: {
    paddingHorizontal: 5,
    fontSize: 16,
  },
});

export default InputNumber;
