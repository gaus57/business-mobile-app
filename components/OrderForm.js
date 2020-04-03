import * as React from 'react';
import {View, Text, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import {Button, Card, ListItem, Overlay, CheckBox, Input} from 'react-native-elements'
import InputNumber from './form/InputNumber';
import InputText from './form/InputText';
import ProductList from './ProductsList';
import DateTimePicker from './form/DateTimePicker';
import {moneyFormat} from '../helpers/number';

const OrderForm = ({setState, onSubmit, data}) => {
  const [firstRender, setFirstRender] = React.useState(true);
  const [showProductPicker, setShowProductPicker] = React.useState(false);
  const totalSum = data.orderProducts.reduce((sum, product) => (sum + product.price*product.qty), 0);

  React.useEffect(() => {
    !firstRender && setState((state) => ({...state, total: totalSum}));
  }, [totalSum]);

  React.useEffect(() => {
    setFirstRender(false);
  }, []);

  const addProduct = React.useCallback((p) => {
    for (let i in data.orderProducts) {
      let op = data.orderProducts[i];
      if (p.id === op.product_id) {
        ToastAndroid.show('Товар уже добавлен к заказу', ToastAndroid.SHORT);
        return;
      }
    }

    setState((state) => {
      const newState = {...state};
      newState.orderProducts.push({
        product_id: p.id,
        price: p.price,
        qty: '',
        unit_id: p.unit_id,
        unit: p.unit,
        product: p,
      });
      return newState;
    });
    setShowProductPicker(false);
  }, [data.orderProducts]);

  return (
    <View style={styles.container}>

      <Card title='Товары'>
        <>
          {data.orderProducts.map((orderProduct, i) => <ListItem
            key={orderProduct.product_id}
            title={orderProduct.product.name}
            subtitle={`${moneyFormat(orderProduct.price)} ₽ / ${orderProduct.unit.name}`}
            input={{
              inputComponent: InputQty,
              value: ''+orderProduct.qty,
              keyboardType: 'numeric',
              containerStyle: {flexGrow: .5, height: 40},
              inputStyle: {paddingHorizontal: 5},
              onChangeText: (val) => {
                setState((state) => {
                  const newState = {...state};
                  state.orderProducts[i].qty = val.replace(/[^\d.]/g, '');
                  return newState;
                });
              },
            }}
            buttonGroup={{
              buttons: ['X'],
              containerStyle: {flexGrow: .3},
              buttonStyle: {},
              onPress: (_) => {
                setState((state) => {
                  const newState = {...state};
                  newState.orderProducts.splice(i, 1);
                  return newState;
                });
              },
            }}
            containerStyle={{paddingHorizontal: 0}}
          />)}
          <Button
            type={'outline'}
            title={'Добавить товар'}
            containerStyle={{marginTop: 20}}
            onPress={() => {setShowProductPicker(true)}} />
        </>
      </Card>

      <Overlay
        isVisible={showProductPicker}
        onBackdropPress={() => {setShowProductPicker(false)}}
        overlayStyle={{padding: 0}}
      >
        <ProductList
          sort={['name']}
          onPresItem={addProduct}
        />
      </Overlay>

      <InputNumber
        label='Сумма'
        value={data.total}
        rightIcon={
          <Text>
            {data.total !== totalSum && `${data.total > totalSum ? '+' : ''}${Math.round((data.total - totalSum) / totalSum * 100 * 10) / 10}%`}
          </Text>
        }
        onChange={(total) => {
          setState((state) => ({...state, total}))
        }} />

      <InputText
        label='Комментарий'
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
        label='Время заказа'
        value={data.created_at}
        onChange={(created_at) => {
          setState((state) => ({...state, created_at}))
        }}
      />}

      <Button
        containerStyle={styles.button}
        title="Сохранить"
        onPress={() => { onSubmit(data) }}
      />
    </View>
  )
};

const InputQty = (props) => {
  const ref = React.useRef();

  React.useEffect(() => {
    if (props.value) return;
    ref.current.focus();
  }, []);

  return (
    <Input ref={ref} {...props} />
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

export default OrderForm
