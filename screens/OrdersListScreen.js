import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Repo from '../repository/repo'
import AddButton from '../components/AddButton'
import SearchFilterBar from '../components/SearchFilterBar';
import InfiniteScrollList from '../components/InfiniteScrollList';
import OrderListItem from '../components/OrderListItem';
import {moneyFormat} from '../helpers/number';

const perPage = 30;
const orderListKeyExtractor = (item) => item.id.toString();

const OrdersListScreen = ({route, navigation}) => {
  const {filters = {}, sort = []} = route.params ?? {};
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [orderTotalRange, setOrderTotalRange] = React.useState({});
  const [orderDateRange, setOrderDateRange] = React.useState({});
  const [orders, setOrders] = React.useState([]);

  const refresh = React.useCallback(async () => {
    let models = await Repo.GetOrders({filters, sort, page: 1, limit: perPage});
    const range = await Repo.GetOrdersTotalRange();
    const dateRange = await Repo.GetOrderCreatedAtRange();
    setOrders(models);
    setOrderTotalRange(range);
    setOrderDateRange(dateRange);
    setPage(2);
    setHasMore(true);
    // console.log('refreshing')
  }, [filters, sort]);

  React.useEffect(() => {refresh()}, [route]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;
    const options = {filters, sort, page: page, limit: perPage};
    setPage(page +1);
    // console.log('loadMore', options);
    let models = await Repo.GetOrders(options);
    if (models.length < perPage) {
      setHasMore(false);
    }
    setOrders((state) => state.concat(models));
    // console.log('loadMore complete', options);
  }, [hasMore, page, filters, sort]);

  const onPressOrder = React.useCallback((item) => {
    navigation.navigate('Order', {id: item.id})
  }, [navigation]);

  const renderOrder = React.useCallback(({item}) => <OrderListItem
    item={item}
    onPress={onPressOrder}
  />, [onPressOrder]);

  return (
    <View style={styles.container}>
      <InfiniteScrollList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={orderListKeyExtractor}
        onRefresh={refresh}
        loadMore={loadMore}
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
                }
              },
            }}
            onChange={(newFilters) => {
              // console.log('onValuesChangeFinish', newFilters);
              navigation.setParams({...(route.params || {}), filters: newFilters});
            }}
          />
        }
        ListFooterComponent={!hasMore && <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>}
        ListEmptyComponent={page > 1 && <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет заказов</Text>}
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
