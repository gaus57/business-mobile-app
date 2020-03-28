import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {ListItem} from 'react-native-elements'
import Repo from '../repository/repo';
import InfiniteScrollList from './InfiniteScrollList';

const perPage = 30;
const productListKeyExtractor = (item) => item.id.toString();

const ProductList = ({filters, sort, onPresItem, isChecked}) => {
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const refresh = React.useCallback(async () => {
    let models = await Repo.GetProducts({filters, sort, page: 1, limit: perPage});
    setProducts(models);
    setPage(2);
    setHasMore(true);
    // console.log('refreshing')
  }, [filters, sort]);

  React.useEffect(() => {refresh()}, []);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;
    const options = {filters, sort, page: page, limit: perPage};
    setPage(page +1);
    // console.log('loadMore', options);
    let models = await Repo.GetProducts(options);
    if (models.length < perPage) {
      setHasMore(false);
    }
    setProducts((state) => state.concat(models));
    // console.log('loadMore complete', options);
  }, [hasMore, page, filters, sort]);

  const renderProduct = React.useCallback(({item}) => <Item
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
        onRefresh={refresh}
        loadMore={loadMore}
        // ListHeaderComponent={}
        ListFooterComponent={!hasMore && <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>}
        ListEmptyComponent={page > 1 && <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет товаров</Text>}
      />
    </>
  )
};

const Item = React.memo(({item, onPress, withCheckbox, isChecked}) => {
  return (
    <ListItem
      key={item.id}
      title={item.name}
      rightTitle={`${item.price} ₽`}
      rightSubtitle={`/ ${item.unit.name}`}
      leftIcon={withCheckbox && {
        type: 'ionicon',
        name: isChecked ? 'md-checkbox-outline' : 'md-square-outline',
      }}
      onPress={() => onPress(item)}
      // containerStyle={{backgroundColor: null}}
      bottomDivider
    />
  )
});

export default ProductList
