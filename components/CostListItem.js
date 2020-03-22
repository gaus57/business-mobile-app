import React from 'react';
import {ListItem} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {dateTimeText} from '../helpers/date';

const CostListItem = ({item, onPress}) => {
  const _onPress = React.useCallback(() => {onPress(item)}, [onPress]);

  return (
    <ListItem
      key={item.id}
      title={dateTimeText(item.created_at)}
      subtitle={item.comment}
      rightTitle={`${item.total} ₽`}
      onPress={_onPress}
      containerStyle={styles.container}
      bottomDivider
    />
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: null,
  }
});

export default React.memo(CostListItem);
