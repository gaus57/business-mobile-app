import React from 'react';
import {StyleSheet, ToastAndroid} from 'react-native';
import Repo from '../repository/repo';
import CostForm from '../components/CostForm';
import ScrollViewKeyboardFix from '../components/ScrollViewKeyboardFix';

const CostCreateScreen = ({navigation}) => {
  const [cost, setCost] = React.useState({comment: '', total: ''});

  const submit = React.useCallback(async (data) => {
    await Repo.CreateCost(data);
    ToastAndroid.show('Расход сохранен', ToastAndroid.SHORT);
    navigation.replace('CostsList');
  }, [navigation]);

  return (
    <ScrollViewKeyboardFix style={{flex: 1}}>
      <CostForm
        data={cost}
        setState={setCost}
        onSubmit={submit} />
    </ScrollViewKeyboardFix>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default CostCreateScreen
