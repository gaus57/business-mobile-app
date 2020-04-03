import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements'
import InputNumber from './form/InputNumber';
import InputText from './form/InputText';
import Picker from './form/Picker'

const ProductForm = ({units = [], setState, onSubmit, data}) => {
  return (
    <View style={styles.container}>
      <InputText
        label='Название'
        value={data.name}
        onChange={(name) => {
          setState((state) => ({...state, name}))
        }} />

      <InputNumber
        label='Цена'
        value={data.price}
        onChange={(price) => {
          setState((state) => ({...state, price}))
        }} />

      <Picker
        label='Единица измерения'
        value={data.unit_id}
        items={units.map(item => [item.id, item.name])}
        onChange={(itemValue, itemIndex) => {
          console.log('Change unit_id', itemValue);
          setState((state) => ({...state, unit_id: itemValue}))
        }} />

      <Button
        containerStyle={styles.button}
        title="Сохранить"
        onPress={() => { onSubmit(data) }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    margin: 10,
    marginTop: 30,
  },
});

export default ProductForm
