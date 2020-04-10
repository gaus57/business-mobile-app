import React from 'react';
import {ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BottomTabItem from './BottomTabItem';
import Repo from '../repository/repo';
import ConfirmPopup from './ConfirmPopup';
import TabBarIcon from './TabBarIcon';

const BottomTabRemoveProduct = ({route}) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [product, setProduct] = React.useState();

  const {id} = route.params;
  const deleted = !!product && !!product.deleted_at;
  const navigation = useNavigation();

  const confirm = React.useCallback(() => {
    setShowConfirm(true);
  }, []);

  const cancel = React.useCallback(() => {
    setShowConfirm(false);
  }, []);

  const onOk = React.useCallback(async () => {
    if (deleted) {
      await Repo.RepairProduct(id);
      ToastAndroid.show('Товар восстановлен', ToastAndroid.SHORT);
    } else {
      await Repo.RemoveProduct(id);
      ToastAndroid.show('Товар удален', ToastAndroid.SHORT);
    }
    setShowConfirm(false);
    navigation.jumpTo(route.name, {id, v: Date.now()});
  }, [deleted, route, navigation, id]);

  React.useEffect(() => {
    async function load() {
      const model = await Repo.GetProduct(id);
      setProduct(model);
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
        title={deleted ? 'Восстановить товар?' : 'Удалить товар?'}
        okText={deleted ? 'Восстановить' : 'Удалить'}
        cancelText='Отмена'
        onOk={onOk}
        onCancel={cancel}
      />
    </>
  )
};

export default BottomTabRemoveProduct
