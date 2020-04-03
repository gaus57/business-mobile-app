import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import Repo from '../repository/repo';
import {indexBy} from '../helpers/map';
import MultiLineZoomChart from '../components/chart/MultiLineZoomChart';

const Analytics1Screen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState({});

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const revenue = await Repo.GetStatOrdersTotal();
    const costs = await Repo.GetStatCostsTotal();

    const newData = prepareData({revenue, costs});
    setData(newData);

    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      {data.profit.length > 0 && <MultiLineZoomChart
        lines={[
          {key: '1', color: '#41ff00', title: 'Чистая прибыль', data: data.profit},
          {key: '2', color: '#0007ff', title: 'Выручка', data: data.revenue},
          {key: '3', color: '#ff1200', title: 'Расходы', data: data.costs},
        ]}
      />}

      {!data.profit.length && !refreshing &&
        <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет данных</Text>
      }
    </ScrollView>
  )
};

function prepareData({revenue = [], costs = []}) {
  const indexByDate = (item) => [item.month, item.year].join('.');
  const mapStat = (item) => ({x: new Date(`${item.month}/01/${item.year}`), y: item.value });

  const revenueMap = indexBy(revenue, indexByDate);
  const costsMap = indexBy(costs, indexByDate);
  const profitMap = {};

  for (let item of revenue) {
    profitMap[indexByDate(item)] = {...item};
  }
  for (let item of costs) {
    if (profitMap[indexByDate(item)]) {
      profitMap[indexByDate(item)].value -= item.value;
      continue;
    }
    profitMap[indexByDate(item)] = {...item, value: -item.value};
  }
  // заполняем пустые промежутки нулевыми значениями
  for (let key in profitMap) {
    if (!revenueMap[key]) {
      revenueMap[key] = {...profitMap[key], value: 0};
    }
    if (!costsMap[key]) {
      costsMap[key] = {...profitMap[key], value: 0};
    }
  }

  return {
    revenue: Object.values(revenueMap).map(mapStat),
    costs: Object.values(costsMap).map(mapStat),
    profit: Object.values(profitMap).map(mapStat),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Analytics1Screen
