import React from 'react';
import {ToastAndroid, StyleSheet} from 'react-native';
import ProductForm from '../components/ProductForm'
import Repo from '../repository/repo'
import Data from '../constants/Data';
import ScrollViewKeyboardFix from '../components/ScrollViewKeyboardFix';

const productDefault = {name: '', price: '', unit_id: Data.DefaultUnitId};

const ProductCreateScreen = ({navigation}) => {
  const [units, setUnits] = React.useState([]);
  const [product, setProduct] = React.useState(productDefault);

  React.useEffect(() => {
    async function load() {
      let models = await Repo.GetUnits();
      setUnits(models);
      setProduct(productDefault);
    }
    load();
  }, []);

  return (
    <ScrollViewKeyboardFix
      style={{flex: 1}}
    >
      <ProductForm
        data={product}
        units={units}
        setState={setProduct}
        onSubmit={async (data) => {
          await Repo.CreateProduct(data);
          ToastAndroid.show('Товар сохранен', ToastAndroid.SHORT);
          navigation.navigate('ProductsList', {v: Date.now()});
        }} />
    </ScrollViewKeyboardFix>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ProductCreateScreen
