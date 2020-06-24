import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Repo from '../repository/repo'
import AddButton from '../components/AddButton'
import SearchFilterBar from '../components/SearchFilterBar';
import InfiniteScrollList from '../components/InfiniteScrollList';
import OrderListItem from '../components/OrderListItem';
import {moneyFormat} from '../helpers/number';

const perPage = 50;
const orderListKeyExtractor = (item) => item.id.toString();

const OrdersListScreen = ({route, navigation}) => {
  const [page, setPage] = React.useState(1);
  const [orderTotalRange, setOrderTotalRange] = React.useState({});
  const [orderDateRange, setOrderDateRange] = React.useState({});
  const [orders, setOrders] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const {filters = {}, sort = []} = route.params ?? {};
  const hasMore = orders.length < total;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const totalItems = await Repo.GetOrdersTotal({filters});
    const models = await Repo.GetOrders({filters, sort, page: 1, limit: perPage});
    const totalRange = await Repo.GetOrdersTotalRange();
    const dateRange = await Repo.GetOrderCreatedAtRange();

    setTotal(totalItems);
    setOrders(models);
    setOrderTotalRange(totalRange);
    setOrderDateRange(dateRange);
    setPage(2);

    setRefreshing(false);
  }, [filters, sort]);

  React.useEffect(() => {refresh()}, [route]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;

    const options = {filters, sort, page: page, limit: perPage};
    setPage(page +1);
    const models = await Repo.GetOrders(options);
    setOrders((state) => state.concat(models));
  }, [hasMore, page, filters, sort]);

  const onPressOrder = React.useCallback((item) => {
    navigation.navigate('Order', {id: item.id})
  }, [navigation]);

  const renderOrder = React.useCallback(({item}) => <OrderListItem
    key={item.id}
    item={item}
    onPress={onPressOrder}
  />, [onPressOrder]);

  return (
    <View style={styles.container}>
      <InfiniteScrollList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={orderListKeyExtractor}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        ListHeaderComponent={
          <SearchFilterBar
            filters={filters}
            options={{
              search: {field: 'search'},
              filters: {
                total: {
                  type: 'rangeSlider',
                  ...orderTotalRange,
                  label: 'Сумма',
                  text: values => `от ${moneyFormat(values[0])} до ${moneyFormat(values[1])} ₽`,
                },
                created_at: {
                  type: 'rangeDate',
                  ...orderDateRange,
                  label: 'Дата',
                },
                deleted_at: {
                  type: 'checkbox',
                  text: 'Удаленные продажи',
                },
              },
            }}
            onChange={(newFilters) => {
              navigation.setParams({...(route.params || {}), filters: newFilters});
            }}
          />
        }
        ListFooterComponent={
          !hasMore && orders.length > 0 &&
          <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>
        }
        ListEmptyComponent={
          page > 1 &&
          <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет продаж</Text>
        }
      />

      <AddButton onPress={()=>{navigation.navigate('OrderCreate')}} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default OrdersListScreen
