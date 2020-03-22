import React from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import Repo from '../repository/repo';
import {dateTimeText} from '../helpers/date';
import {ListItem} from 'react-native-elements';

const ProductScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [refreshing, setRefreshing] = React.useState(false);
  const [product, setProduct] = React.useState();

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    const model = await Repo.GetProduct(id);
    setProduct(model);
    setRefreshing(false);
  }, [id]);

  React.useEffect(() => {
    refresh();
  }, [id]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      {product && <>
        <ListItem
          title='Название'
          subtitle={product.name}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />

        <ListItem
          title='Цена'
          subtitle={`${product.price} ₽ / ${product.unit.name}`}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
          bottomDivider
        />

        <ListItem
          title='Создан'
          subtitle={dateTimeText(product.created_at)}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />

        <ListItem
          title='Изменен'
          subtitle={dateTimeText(product.updated_at)}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />
      </>}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: null,
  },
  label: {
    fontSize: 17,
  },
  value: {
    fontSize: 17,
  },
});

export default ProductScreen
