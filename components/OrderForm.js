import * as React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button, Card, ListItem, Overlay, CheckBox} from 'react-native-elements'
import InputNumber from './form/InputNumber';
import InputText from './form/InputText';
import ProductList from './ProductsList';
import DateTimePicker from './form/DateTimePicker';

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

  return (
    <View style={styles.container}>

      <Card title='Товары'>
        <>
          {data.orderProducts.map((orderProduct, i) => <ListItem
            key={orderProduct.product_id}
            title={orderProduct.product.name}
            subtitle={`${orderProduct.price} ₽ / ${orderProduct.unit.name}`}
            input={{
              value: ''+orderProduct.qty,
              keyboardType: 'numeric',
              containerStyle: {flexGrow: .5, height: 40, borderWidth: 1, borderColor: 'rgba(200, 200, 200, .7)', borderRadius: 5},
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
          onPresItem={(product) => {
            setState((state) => {
              const newState = {...state};
              newState.orderProducts.push({
                product_id: product.id,
                price: product.price,
                qty: '',
                unit_id: product.unit_id,
                unit: product.unit,
                product: product,
              });
              return newState;
            });
            setShowProductPicker(false);
          }}
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

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    margin: 10,
    marginTop: 50
  },
});

export default OrderForm
