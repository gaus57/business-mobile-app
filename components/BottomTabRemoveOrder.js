import React from 'react';
import {ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BottomTabItem from './BottomTabItem';
import Repo from '../repository/repo';
import ConfirmPopup from './ConfirmPopup';
import TabBarIcon from './TabBarIcon';

const BottomTabRemoveOrder = ({route}) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [order, setOrder] = React.useState();

  const {id} = route.params;
  const deleted = !!order && !!order.deleted_at;
  const navigation = useNavigation();

  const confirm = React.useCallback(() => {
    setShowConfirm(true);
  }, []);

  const cancel = React.useCallback(() => {
    setShowConfirm(false);
  }, []);

  const onOk = React.useCallback(async () => {
    if (deleted) {
      await Repo.RepairOrder(id);
      ToastAndroid.show('Продажа восстановлена', ToastAndroid.SHORT);
    } else {
      await Repo.RemoveOrder(id);
      ToastAndroid.show('Продажа удалена', ToastAndroid.SHORT);
    }
    setShowConfirm(false);
    navigation.jumpTo(route.name, {id, v: Date.now()});
  }, [deleted, route, navigation, id]);

  React.useEffect(() => {
    async function load() {
      const model = await Repo.GetOrder(id);
      setOrder(model);
    }
    load();
  }, [route, id]);

  return (
    <>
      <BottomTabItem
        label={deleted ? 'Восстановить' : 'Удалить'}
        icon={() => <TabBarIcon name={deleted ? 'ios-undo' : 'ios-trash'} />}
        onPress={confirm}
      />

      <ConfirmPopup
        isVisible={showConfirm}
        type={deleted ? 'default' : 'danger'}
        title={deleted ? 'Восстановить продажу?' : 'Удалить продажу?'}
        okText={deleted ? 'Восстановить' : 'Удалить'}
        cancelText='Отмена'
        onOk={onOk}
        onCancel={cancel}
      />
    </>
  )
};

export default BottomTabRemoveOrder
