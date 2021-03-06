import React from 'react';
import {StyleSheet, ToastAndroid, RefreshControl, ScrollView} from 'react-native';
import Repo from '../repository/repo';
import OrderForm from '../components/OrderForm';
import ScrollViewKeyboardFix from '../components/ScrollViewKeyboardFix';

const OrderEditScreen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [order, setOrder] = React.useState();

  const {id} = route.params;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const model = await Repo.GetOrder(id);
    setOrder(model);

    setRefreshing(false);
  }, [id]);

  React.useEffect(() => { refresh() }, [route]);

  return (
    <ScrollViewKeyboardFix
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
      dopMargin={-50}
    >
      {order && <OrderForm
        data={order}
        setState={setOrder}
        onSubmit={async (data) => {
          await Repo.UpdateOrder(data);
          ToastAndroid.show('Продажа сохранена', ToastAndroid.SHORT);
          navigation.navigate('OrdersList', {v: Date.now()});
        }}/>}
    </ScrollViewKeyboardFix>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default OrderEditScreen
