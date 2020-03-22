import React from 'react';
import {ListItem} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {dateText} from '../helpers/date';

const OrderListItem = ({item, onPress}) => {
  const _onPress = React.useCallback(() => {onPress(item)}, [onPress]);

  return (
    <ListItem
      key={item.id}
      title={`№ ${item.id}`}
      subtitle={item.orderProducts.map((orderProduct) => `${orderProduct.product.name} x ${orderProduct.qty} ${orderProduct.unit.name}`).join(', ')}
      rightTitle={`${item.total} ₽`}
      rightSubtitle={dateText(item.created_at)}
      containerStyle={styles.container}
      bottomDivider
      onPress={_onPress}
    />
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: null,
  }
});

export default React.memo(OrderListItem)
