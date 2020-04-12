import React from 'react';
import {StyleSheet, RefreshControl, ToastAndroid, ScrollView} from 'react-native';
import Repo from '../repository/repo';
import CostForm from '../components/CostForm';
import ScrollViewKeyboardFix from '../components/ScrollViewKeyboardFix';

const CostEditScreen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [cost, setCost] = React.useState();

  const {id} = route.params;

  const refresh = React.useCallback(() => {
    async function load() {
      setRefreshing(true);
      const model = await Repo.GetCost(id);
      setCost(model);
      setRefreshing(false);
    }
    load();
  }, [id]);

  React.useEffect(() => { refresh() }, [route]);

  const submit = React.useCallback(async (data) => {
    await Repo.UpdateCost(data);
    ToastAndroid.show('Расход сохранен', ToastAndroid.SHORT);
    navigation.navigate('Cost', {id, v: Date.now()});
  }, [navigation]);

  return (
    <ScrollViewKeyboardFix
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
      dopMargin={-50}
    >
      {cost && <CostForm
        data={cost}
        setState={setCost}
        onSubmit={submit} />}
    </ScrollViewKeyboardFix>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default CostEditScreen
