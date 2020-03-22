import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements'

const InputText = ({label, value, error, onChange, lines = 1}) => {
  return (
    <Input
      label={label}
      errorMessage={error}
      value={value}
      multiline={lines > 1}
      numberOfLines={lines}
      inputStyle={styles.input}
      labelStyle={styles.inputLabel}
      onChangeText={onChange} />
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    marginTop: 20,
  },
  input: {
    paddingHorizontal: 5,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default InputText;
