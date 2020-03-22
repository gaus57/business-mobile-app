import React from 'react';
import {StyleSheet, ToastAndroid, ScrollView, RefreshControl} from 'react-native';
import Repo from '../repository/repo';
import ProductForm from '../components/ProductForm';

const ProductEditScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [refreshing, setRefreshing] = React.useState(false);
  const [product, setProduct] = React.useState();
  const [units, setUnits] = React.useState([]);

  const refresh = React.useCallback(() => {
    async function loadProduct() {
      setRefreshing(true);
      const model = await Repo.GetProduct(id);
      setProduct(model);
       setRefreshing(false);
    }
    async function loadUnits() {
      let units = await Repo.GetUnits();
      setUnits(units);
    }
    loadProduct();
    loadUnits();
  }, [id]);

  React.useEffect(() => {
    refresh();
  }, [id]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      {product && <ProductForm
        data={product}
        units={units}
        setState={setProduct}
        onSubmit={async (data) => {
          const product = await Repo.UpdateProduct(data);
          ToastAndroid.show('Товар сохранен', ToastAndroid.SHORT);
          navigation.replace('Product', {id});
        }} />}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ProductEditScreen
