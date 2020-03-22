import * as React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ListItem} from 'react-native-elements'
import Repo from '../repository/repo';

const ProductList = ({filters, sort, onPresItem}) => {
  const [products, setProducts] = React.useState([]);
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    async function loadProducts() {
      let products = await Repo.GetProducts({filters, sort});
      console.log(products);
      setProducts((items) => products);
      setFetched(true);
    }
    loadProducts();
  }, [filters, sort]);

  return (
    <>
      {!fetched && <Text style={{textAlign: 'center'}}>Гружу...</Text>}

      {fetched && !products && <Text style={{textAlign: 'center'}}>Нет товаров</Text>}

      {products && products.map((product) =>
        <ListItem
          key={product.id}
          title={product.name}
          subtitle={`${product.price} ₽ / ${product.unit.name}`}
          containerStyle={{paddingHorizontal: 0, borderBottomWidth: 1}}
          onPress={() => {onPresItem(product)}}
        />)}
    </>
  )
};

export default ProductList
