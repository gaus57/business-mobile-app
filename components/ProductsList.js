import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {ListItem} from 'react-native-elements'
import Repo from '../repository/repo';
import InfiniteScrollList from './InfiniteScrollList';
import {moneyFormat} from '../helpers/number';

const perPage = 50;
const productListKeyExtractor = (item) => item.id.toString();

const ProductList = ({filters, sort, onPresItem, isChecked}) => {
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const hasMore = products.length < total;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const totalItems = await Repo.GetProductsTotal({filters});
    const models = await Repo.GetProducts({filters, sort, page: 1, limit: perPage});

    setTotal(totalItems);
    setProducts(models);
    setPage(2);

    setRefreshing(false);
  }, [filters, sort]);

  React.useEffect(() => {refresh()}, []);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;

    const options = {filters, sort, page: page, limit: perPage};
    setPage(page +1);

    let models = await Repo.GetProducts(options);
    setProducts(state => state.concat(models));
  }, [hasMore, page, filters, sort]);

  const renderProduct = React.useCallback(({item}) => <Item
    key={item.id}
    item={item}
    onPress={onPresItem}
    withCheckbox={!!isChecked}
    isChecked={!!isChecked && isChecked(item)}
  />, [onPresItem, isChecked]);

  return (
    <>
      <InfiniteScrollList
        data={products}
        renderItem={renderProduct}
        keyExtractor={productListKeyExtractor}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        // ListHeaderComponent={}
        ListFooterComponent={!hasMore && !refreshing && <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>}
        ListEmptyComponent={page > 1 && <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет товаров</Text>}
      />
    </>
  )
};

const Item = React.memo(({item, onPress, withCheckbox, isChecked}) => {
  const _onPress = React.useCallback(() => {onPress(item)}, [onPress]);

  return (
    <ListItem
      key={item.id}
      title={item.name}
      rightTitle={`${moneyFormat(item.price)} ₽`}
      rightSubtitle={`/ ${item.unit.name}`}
      leftIcon={withCheckbox && {
        type: 'ionicon',
        name: isChecked ? 'md-checkbox-outline' : 'md-square-outline',
      }}
      onPress={_onPress}
      // containerStyle={{backgroundColor: null}}
      bottomDivider
    />
  )
});

export default ProductList
