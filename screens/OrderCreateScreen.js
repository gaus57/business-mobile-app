import React from 'react';
import {RefreshControl, StyleSheet, ToastAndroid} from 'react-native';
import OrderForm from '../components/OrderForm';
import Repo from '../repository/repo';
import ScrollViewKeyboardFix from '../components/ScrollViewKeyboardFix';

const orderDefault = {
  comment: '',
  total: 0,
  orderProducts: [],
};

const OrderCreateScreen = ({route, navigation}) => {
  const [order, setOrder] = React.useState({...orderDefault, orderProducts: []});

  React.useEffect(() => { setOrder({...orderDefault, orderProducts: []}) }, [route]);

  return (
    <ScrollViewKeyboardFix
      style={{flex: 1}}
    >
      <OrderForm
        data={order}
        setState={setOrder}
        onSubmit={async (data) => {
          await Repo.CreateOrder(data);
          ToastAndroid.show('Продажа сохранена', ToastAndroid.SHORT);
          navigation.navigate('OrdersList', {v: Date.now()});
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
