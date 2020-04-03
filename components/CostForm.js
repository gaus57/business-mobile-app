import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, CheckBox} from 'react-native-elements'
import InputNumber from './form/InputNumber';
import InputText from './form/InputText';
import DateTimePicker from './form/DateTimePicker';

const CostForm = ({setState, onSubmit, data}) => {
  return (
    <View style={styles.container}>
      <InputNumber
        label='Сумма'
        value={data.total}
        onChange={(total) => {
          setState((state) => ({...state, total}))
        }} />

      <InputText
        label='Описание'
        value={data.comment}
        lines={4}
        onChange={(comment) => {
          setState((state) => ({...state, comment}))
        }} />

      {!data.created_at && <CheckBox
        title='Текущее время'
        checked={!data.created_at}
        onPress={() => {
          setState((state) => ({...state, created_at: state.created_at ? undefined : Date.now()}))
        }}
        containerStyle={{backgroundColor: null, borderWidth: 0}}
      />}

      {data.created_at && <DateTimePicker
        label='Дата расхода'
        value={data.created_at}
        onChange={(created_at) => {
          setState((state) => ({...state, created_at}))
        }}
      />}

      <Button
        containerStyle={styles.button}
        title="Сохранить"
        onPress={() => {onSubmit(data)}}
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
    marginTop: 20,
  },
});

export default CostForm;
