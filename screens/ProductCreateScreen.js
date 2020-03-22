import React from 'react';
import {ToastAndroid, StyleSheet, ScrollView} from 'react-native';
import ProductForm from '../components/ProductForm'
import Repo from '../repository/repo'
import Data from '../constants/Data';

const ProductCreateScreen = ({navigation}) => {
  const [units, setUnits] = React.useState([]);
  const [product, setProduct] = React.useState({name: '', price: '', unit_id: Data.DefaultUnitId});

  React.useEffect(() => {
    async function load() {
      let models = await Repo.GetUnits();
      setUnits(models);
      // for (let i = 1; i < 100; i++) {
      //   await Repo.CreateProduct({name: `product ${i}`, price: 10, unit_id: Data.DefaultUnitId});
      // }
    }
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ProductForm
        data={product}
        units={units}
        setState={setProduct}
        onSubmit={async (data) => {
          await Repo.CreateProduct(data);
          ToastAndroid.show('Товар сохранен', ToastAndroid.SHORT);
          navigation.replace('ProductsList');
        }} />
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ProductCreateScreen
