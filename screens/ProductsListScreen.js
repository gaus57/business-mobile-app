import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Repo from "../repository/repo";
import AddButton from "../components/AddButton";
import SearchFilterBar from '../components/SearchFilterBar';
import InfiniteScrollList from '../components/InfiniteScrollList';
import ProductListItem from '../components/ProductListItem';

const perPage = 50;
const productListKeyExtractor = (item) => item.id.toString();

const ProductsListScreen = ({route, navigation}) => {
  const [page, setPage] = React.useState(1);
  const [priceRange, setPriceRange] = React.useState({});
  const [products, setProducts] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const {filters = {}, sort = []} = route.params ?? {};
  const hasMore = products.length < total;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const totalItems = await Repo.GetProductsTotal({filters});
    const models = await Repo.GetProducts({filters, sort, page: 1, limit: perPage});
    const range = await Repo.GetProductPriceRange();

    setTotal(totalItems);
    setProducts(models);
    setPriceRange(range);
    setPage(2);

    setRefreshing(false);
  }, [filters, sort]);

  React.useEffect(() => {refresh()}, [route]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;

    const options = {filters, sort, page: page, limit: perPage};
    setPage(page +1);
    const models = await Repo.GetProducts(options);
    setProducts((state) => state.concat(models));
  }, [hasMore, page, filters, sort]);

  const onPressProduct = React.useCallback((item) => {
    navigation.navigate('Product', {id: item.id})
  }, [navigation]);

  const renderProduct = React.useCallback(({item}) => <ProductListItem
    key={item.id}
    item={item}
    onPress={onPressProduct}
  />, [onPressProduct]);

  return (
    <View style={styles.container}>
      <InfiniteScrollList
        data={products}
        renderItem={renderProduct}
        keyExtractor={productListKeyExtractor}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={loadMore}
        ListHeaderComponent={
          <SearchFilterBar
            filters={filters}
            options={{
              search: {field: 'name'},
              filters: {
                price: {
                  type: 'rangeSlider',
                  label: 'Цена',
                  ...priceRange,
                  text: values => `от ${values[0]} до ${values[1]} ₽`,
                },
                deleted_at: {
                  type: 'checkbox',
                  text: 'Удаленные товары',
                },
              },
            }}
            onChange={(newFilters) => {
              navigation.setParams({...(route.params || {}), filters: newFilters});
            }}
          />
        }
        ListFooterComponent={
          !hasMore && products.length > 0 &&
          <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>
        }
        ListEmptyComponent={
          page > 1 &&
          <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет товаров</Text>
        }
      />

      <AddButton onPress={()=>{navigation.navigate('ProductCreate')}} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ProductsListScreen
