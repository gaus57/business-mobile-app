import React from 'react';
import {ScrollView, StyleSheet, View, RefreshControl} from 'react-native';
import Repo from '../repository/repo';
import {Card, ListItem} from 'react-native-elements';
import {dateTimeText} from '../helpers/date';
import {moneyFormat} from '../helpers/number';

const OrderScreen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [order, setOrder] = React.useState();

  const {id} = route.params;
  const totalSum = order
    ? order.orderProducts.reduce((sum, product) => (sum + product.price*product.qty), 0)
    : 0;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    const model = await Repo.GetOrder(id);
    setOrder(model);
    setRefreshing(false);
  }, [id]);

  React.useEffect(() => { refresh() }, [route]);

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
          subtitle={`${moneyFormat(orderProduct.price)} ₽ x ${orderProduct.qty} ${orderProduct.unit.name}`}
          rightTitle={`${moneyFormat(orderProduct.price*orderProduct.qty)} ₽`}
          containerStyle={{paddingHorizontal: 0}}
        />)}
      </Card>
      <View style={{margin: 10}}>
        <ListItem
          title='Стоимость товаров'
          rightTitle={`${moneyFormat(totalSum)} ₽`}
          containerStyle={styles.itemContainer}
        />
        <ListItem
          title={totalSum < order.total ? 'Наценка' : 'Скидка'}
          rightTitle={`${moneyFormat(Math.abs(totalSum - order.total))} ₽`}
          rightSubtitle={order.total !== totalSum ? `${Math.round(Math.abs(order.total - totalSum) / totalSum * 100 * 10) / 10}%` : null}
          containerStyle={styles.itemContainer}
        />
        <ListItem
          title='ИТОГО'
          rightTitle={`${moneyFormat(order.total)} ₽`}
          containerStyle={styles.itemContainer}
          bottomDivider
        />

        <ListItem
          title='Оформлена'
          subtitle={dateTimeText(order.created_at)}
          containerStyle={styles.itemContainer}
        />

        <ListItem
          title='Изменена'
          subtitle={dateTimeText(order.updated_at)}
          containerStyle={styles.itemContainer}
        />

        {!!order.deleted_at && <ListItem
          title='Удалена'
          subtitle={dateTimeText(order.deleted_at)}
          containerStyle={styles.itemContainer}
        />}
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
