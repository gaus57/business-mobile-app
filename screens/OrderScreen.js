import React from 'react';
import {ScrollView, StyleSheet, View, RefreshControl} from 'react-native';
import Repo from '../repository/repo';
import {Card, ListItem} from 'react-native-elements';
import {dateTimeText} from '../helpers/date';

const OrderScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [refreshing, setRefreshing] = React.useState(false);
  const [order, setOrder] = React.useState();
  const totalSum = order
    ? order.orderProducts.reduce((sum, product) => (sum + product.price*product.qty), 0)
    : 0;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    const model = await Repo.GetOrder(id);
    setOrder(model);
    setRefreshing(false);
  }, [id]);

  React.useEffect(() => {
    refresh();
  }, [id]);

  if (!order) {
    return null;
  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      <Card title='Товары'>
        {order.orderProducts.map(orderProduct => <ListItem
          key={orderProduct.id}
          title={orderProduct.product.name}
          subtitle={`${orderProduct.price} ₽ x ${orderProduct.qty} ${orderProduct.unit.name}`}
          rightTitle={`${orderProduct.price*orderProduct.qty} ₽`}
          containerStyle={{paddingHorizontal: 0}}
        />)}
      </Card>
      <View style={{margin: 10}}>
        <ListItem
          title='Стоимость товаров'
          rightTitle={`${totalSum} ₽`}
          containerStyle={styles.itemContainer}
        />
        <ListItem
          title={totalSum < order.total ? 'Наценка' : 'Скидка'}
          rightTitle={`${Math.abs(totalSum - order.total)} ₽`}
          rightSubtitle={order.total !== totalSum ? `${Math.round(Math.abs(order.total - totalSum) / totalSum * 100 * 10) / 10}%` : null}
          containerStyle={styles.itemContainer}
        />
        <ListItem
          title='ИТОГО'
          rightTitle={`${order.total} ₽`}
          containerStyle={styles.itemContainer}
          bottomDivider
        />

        <ListItem
          title='Оформлен'
          subtitle={dateTimeText(order.created_at)}
          containerStyle={styles.itemContainer}
        />

        <ListItem
          title='Изменен'
          subtitle={dateTimeText(order.updated_at)}
          containerStyle={styles.itemContainer}
        />
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: null,
  }
});

export default OrderScreen
