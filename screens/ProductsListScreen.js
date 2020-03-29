import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Repo from "../repository/repo";
import AddButton from "../components/AddButton";
import SearchFilterBar from '../components/SearchFilterBar';
import InfiniteScrollList from '../components/InfiniteScrollList';
import ProductListItem from '../components/ProductListItem';

const perPage = 30;
const productListKeyExtractor = (item) => item.id.toString();

const ProductsListScreen = ({route, navigation}) => {
  const {filters = {}, sort = []} = route.params ?? {};
  console.log('ProductsListScreen route.params', route.params);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [priceRange, setPriceRange] = React.useState({});
  const [products, setProducts] = React.useState([]);

  const refresh = React.useCallback(async () => {
    let models = await Repo.GetProducts({filters, sort, page: 1, limit: perPage});
    const range = await Repo.GetProductPriceRange();
    setProducts(models);
    setPriceRange(range);
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
    let models = await Repo.GetProducts(options);
    if (models.length < perPage) {
      setHasMore(false);
    }
    setProducts((state) => state.concat(models));
    // console.log('loadMore complete', options);
  }, [hasMore, page, filters, sort]);

  const onPressProduct = React.useCallback((item) => {
    navigation.navigate('Product', {id: item.id})
  }, [navigation]);

  const renderProduct = React.useCallback(({item}) => <ProductListItem
    item={item}
    onPress={onPressProduct}
  />, [onPressProduct]);

  return (
    <View style={styles.container}>
      <InfiniteScrollList
        data={products}
        renderItem={renderProduct}
        keyExtractor={productListKeyExtractor}
        onRefresh={refresh}
        loadMore={loadMore}
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
              },
            }}
            onChange={(newFilters) => {
              // console.log('onValuesChangeFinish', newFilters);
              navigation.setParams({...(route.params || {}), filters: newFilters});
            }}
          />
        }
        ListFooterComponent={!hasMore && <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>}
        ListEmptyComponent={page > 1 && <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет товаров</Text>}
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
