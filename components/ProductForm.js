import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements'
import InputNumber from './form/InputNumber';
import InputText from './form/InputText';
import Picker from './form/Picker'

const ProductForm = ({units = [], setState, onSubmit, data}) => {
  const [validated, setValidated] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const validate = React.useCallback((data) => {
    const ers = {};
    if (!data.price) {
      ers.price = 'Не заполнена цена товара';
    }
    if (!data.name) {
      ers.name = 'Не заполнено название товара';
    }

    setValidated(true);
    setErrors(ers);

    return !Object.entries(ers).length
  }, []);

  React.useEffect(() => {
    validated && validate(data);
  }, [data, validated]);

  return (
    <View style={styles.container}>
      <InputText
        label='Название'
        value={data.name}
        error={errors.name}
        onChange={(name) => {
          setState((state) => ({...state, name}))
        }} />

      <InputNumber
        label='Цена'
        value={data.price}
        error={errors.price}
        onChange={(price) => {
          setState((state) => ({...state, price}))
        }} />

      <Picker
        label='Единица измерения'
        value={data.unit_id}
        items={units.map(item => [item.id, item.name])}
        onChange={(itemValue, itemIndex) => {
          setState((state) => ({...state, unit_id: itemValue}))
        }} />

      <Button
        containerStyle={styles.button}
        title="Сохранить"
        onPress={() => {
          validate(data) && onSubmit(data);
        }}
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
