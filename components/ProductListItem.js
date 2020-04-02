import React from 'react';
import {ListItem} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {moneyFormat} from '../helpers/number';

const ProductListItem = ({item, onPress}) => {
  const _onPress = React.useCallback(() => {onPress(item)}, [onPress]);

  return (
    <ListItem
      key={item.id}
      title={item.name}
      rightTitle={`${moneyFormat(item.price)} ₽`}
      rightSubtitle={`/ ${item.unit.name}`}
      onPress={_onPress}
      containerStyle={styles.container}
      bottomDivider
    />
  )
};

const styles = StyleSheet.create({
  container: {

  }
});

export default React.memo(ProductListItem);
