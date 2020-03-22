import React from 'react';
import {StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import Repo from '../repository/repo';
import CostForm from '../components/CostForm';

const CostCreateScreen = ({navigation}) => {
  const [cost, setCost] = React.useState({comment: '', total: ''});

  const submit = React.useCallback(async (data) => {
    await Repo.CreateCost(data);
    ToastAndroid.show('Расход сохранен', ToastAndroid.SHORT);
    navigation.replace('CostsList');
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <CostForm
        data={cost}
        setState={setCost}
        onSubmit={submit} />
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default CostCreateScreen
