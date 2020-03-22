import React from 'react';
import {StyleSheet, ScrollView, RefreshControl, ToastAndroid} from 'react-native';
import Repo from '../repository/repo';
import CostForm from '../components/CostForm';

const CostEditScreen = ({route, navigation}) => {
  const {id} = route.params;
  const [refreshing, setRefreshing] = React.useState(false);
  const [cost, setCost] = React.useState();

  const refresh = React.useCallback(() => {
    async function load() {
      setRefreshing(true);
      const model = await Repo.GetCost(id);
      setCost(model);
      setRefreshing(false);
    }
    load();
  }, [id]);

  React.useEffect(() => {
    refresh();
  }, [id]);

  const submit = React.useCallback(async (data) => {
    await Repo.UpdateCost(data);
    ToastAndroid.show('Расход сохранен', ToastAndroid.SHORT);
    navigation.replace('Cost', {id});
  }, [navigation]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      {cost && <CostForm
        data={cost}
        setState={setCost}
        onSubmit={submit} />}
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default CostEditScreen
