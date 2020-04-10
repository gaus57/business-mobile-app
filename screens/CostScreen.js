import React from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import Repo from '../repository/repo';
import {ListItem} from 'react-native-elements';
import {dateTimeText} from '../helpers/date';
import {moneyFormat} from '../helpers/number';

const CostScreen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [cost, setCost] = React.useState();

  const {id} = route.params;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    const model = await Repo.GetCost(id);
    setCost(model);
    setRefreshing(false);
  }, [id]);

  React.useEffect(() => { refresh() }, [route]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      {cost && <>
        <ListItem
          title='Сумма'
          subtitle={`${moneyFormat(cost.total)} ₽`}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />

        <ListItem
          title='Описание'
          subtitle={cost.comment}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
          bottomDivider
        />

        <ListItem
          title='Создан'
          subtitle={dateTimeText(cost.created_at)}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />

        <ListItem
          title='Изменен'
          subtitle={dateTimeText(cost.updated_at)}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />

        {!!cost.deleted_at && <ListItem
          title='Удален'
          subtitle={dateTimeText(cost.deleted_at)}
          containerStyle={styles.itemContainer}
          titleStyle={styles.label}
          subtitleStyle={styles.value}
        />}
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

export default CostScreen
