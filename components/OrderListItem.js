import React from 'react';
import {ListItem} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {dateText} from '../helpers/date';
import {moneyFormat} from '../helpers/number';

const OrderListItem = ({item, onPress}) => {
  const _onPress = React.useCallback(() => {onPress(item)}, [onPress]);

  return (
    <ListItem
      title={`№ ${item.id}`}
      subtitle={item.orderProducts.map((orderProduct) => `${orderProduct.product.name} x ${orderProduct.qty} ${orderProduct.unit.name}`).join(', ')}
      rightTitle={dateText(item.created_at)}
      rightSubtitle={`${moneyFormat(item.total)} ₽`}
      containerStyle={styles.container}
      bottomDivider
      onPress={_onPress}
    />
  )
};

const styles = StyleSheet.create({
  container: {

  }
});

export default React.memo(OrderListItem)
