import React from 'react';
import {ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import OrderForm from '../components/OrderForm';
import Repo from '../repository/repo';

const orderDefault = {
  comment: '',
  total: 0,
  orderProducts: [],
};

function createRandomOrder(products) {
  const newOrder = {comment: '', orderProducts: []};
  const pc = Math.ceil(Math.random() * 10);
  let total = 0;
  const pmap = {};
  for (let i = 1; i <= pc; i++) {
    let p = products[Math.floor(Math.random()*(products.length-1))];
    if (pmap[p.id]) {
      continue;
    }
    pmap[p.id] = true;
    const qty = Math.ceil(Math.random() * 100);
    newOrder.orderProducts.push({product_id: p.id, unit_id: p.unit_id, qty, price: p.price});
    total += qty*p.price;
  }
  newOrder.total = total + Math.ceil(((Math.random()*total/100*40)-(total/100*20))*100)/100;
  const date = new Date();
  date.setFullYear(2020-Math.floor(Math.random()*4), Math.ceil(Math.random()*12), Math.ceil(Math.random()*27));
  newOrder.created_at = date.getTime();

  return Repo.CreateOrder(newOrder);
}

const OrderCreateScreen = ({navigation}) => {
  const [order, setOrder] = React.useState(orderDefault);

  React.useEffect(() => {
    async function load() {
      const products = await Repo.GetProducts({}, [], 1, 1000);
      for (let i = 0; i < 200; i++) {
        await createRandomOrder(products);
      }
      ToastAndroid.show('Заказы добавлены', ToastAndroid.SHORT);
    }
    // load();
  }, []);

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
