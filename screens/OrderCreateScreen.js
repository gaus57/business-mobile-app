import React from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import OrderForm from '../components/OrderForm';
import Repo from '../repository/repo';
import ScrollViewKeyboardFix from '../components/ScrollViewKeyboardFix';

const orderDefault = {
  comment: '',
  total: 0,
  orderProducts: [],
};

const OrderCreateScreen = ({navigation}) => {
  const [order, setOrder] = React.useState(orderDefault);

  return (
    <ScrollViewKeyboardFix
      style={{flex: 1}}
    >
      <OrderForm
        data={order}
        setState={setOrder}
        onSubmit={async (data) => {
          await Repo.CreateOrder(data);
          ToastAndroid.show('Заказ сохранен', ToastAndroid.SHORT);
          navigation.replace('OrdersList');
        }}/>
    </ScrollViewKeyboardFix>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default OrderCreateScreen
