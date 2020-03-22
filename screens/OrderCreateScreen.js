import React from 'react';
import {ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import OrderForm from '../components/OrderForm';
import Repo from '../repository/repo';

const OrderCreateScreen = ({navigation}) => {
  const [order, setOrder] = React.useState({
    comment: '',
    total: 0,
    orderProducts: [],
  });
  return (
    <ScrollView style={styles.container}>
      <OrderForm
        data={order}
        setState={setOrder}
        onSubmit={async (data) => {
          const order = await Repo.CreateOrder(data);
          ToastAndroid.show('Заказ сохранен', ToastAndroid.SHORT);
          navigation.replace('OrdersList');
        }}/>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default OrderCreateScreen
