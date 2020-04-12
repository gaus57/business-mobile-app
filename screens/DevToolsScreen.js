import React from 'react';
import {ScrollView, Text, ToastAndroid} from 'react-native';
import {Button} from 'react-native-elements';
import Repo from '../repository/repo';
import testData from '../repository/testdata'

const DevToolsScreen = ({}) => {
  const [loadingData, setLoadingData] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setLoadingData(true);

    await loadTestData();
    ToastAndroid.show('Данные загружены', ToastAndroid.SHORT);

    setLoadingData(false);
  }, []);

  return (
    <ScrollView style={{padding: 10}}>
      <Button
        type='outline'
        title='Загрузить тестовые данные'
        containerStyle={{marginHorizontal: 20, marginVertical: 15}}
        loading={loadingData}
        disabled={loadingData}
        onPress={loadData}
      />
      {loadingData && <Text style={{textAlign: 'center', fontSize: 16}}>Загрузка данных...</Text>}
      {loadingData && <Text style={{textAlign: 'center', fontSize: 16}}>Это может занять несколько минут!</Text>}
    </ScrollView>
  )
};

async function loadTestData() {
  //  Создаем товары
  await Promise.all(testData.ProductsList.map(p => new Promise(async (resolve, _) => {
    await Repo.CreateProduct(p);
    resolve();
  })));

  // Создаем заказы
  const products = await Repo.GetProducts({}, [], 1, 1000);
  for (let i = 0; i < 20; i++) {
    await Promise.all(Array.apply(null, Array(10)).map(() => new Promise(async (resolve, _) => {
      await createRandomOrder(products);
      resolve();
    })));
  }

  // Создаем расходы
  for (let i = 0; i < 20; i++) {
    await Promise.all(Array.apply(null, Array(10)).map(() => new Promise(async (resolve, _) => {
      const date = new Date(Date.now() - Math.floor(Math.random()*3*365*24*60*60*1000));
      await Repo.CreateCost({
        total: Math.ceil(Math.random() * 30000 + 1500),
        created_at: date.getTime(),
        comment: 'На что-то там...',
      });
      resolve();
    })));
  }
}

async function createRandomOrder(products) {
  const newOrder = {comment: '', orderProducts: []};
  const pc = Math.ceil(Math.random() * 10);
  let total = 0;
  const pmap = {};
  for (let i = 1; i <= pc; i++) {
    let p = products[Math.floor(Math.random()*(products.length-1))];
    if (pmap[p.id]) {
      continue;
    }
    pmap[p.id] = true;
    const qty = Math.ceil(Math.random() * 100);
    newOrder.orderProducts.push({product_id: p.id, unit_id: p.unit_id, qty, price: p.price});
    total += qty*p.price;
  }
  newOrder.total = total + Math.ceil(((Math.random()*total/100*40)-(total/100*20))*100)/100;
  const date = new Date(Date.now() - Math.floor(Math.random()*3*365*24*60*60*1000));
  newOrder.created_at = date.getTime();

  return await Repo.CreateOrder(newOrder);
}

export default DevToolsScreen
