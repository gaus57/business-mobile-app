import React from 'react';
import {Text, StyleSheet, ScrollView, RefreshControl, View} from 'react-native';
import Repo from '../repository/repo';
import {indexBy} from '../helpers/map';
import {ceilDate, floorDate, floorMonth} from '../helpers/date';
import DateRange from '../components/filters/DateRange';
import MultiLineChart from '../components/chart/MultiLineChart';

const Analytics1Screen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState({});
  const [dateScope, setDateScope] = React.useState({});

  const {from, to} = route.params || {};

  const changeDateRange = React.useCallback((val) => {
    navigation.setParams({from: val[0], to: val[1]})
  }, [navigation]);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const scopeOrder = await Repo.GetOrderCreatedAtRange();
    if (scopeOrder.min) scopeOrder.min = floorDate(new Date(scopeOrder.min)).getTime();
    if (scopeOrder.max) scopeOrder.max = ceilDate(new Date(scopeOrder.max)).getTime();
    const scopeCost = await Repo.GetCostCreatedAtRange();
    if (scopeCost.min) scopeCost.min = floorDate(new Date(scopeCost.min)).getTime();
    if (scopeCost.max) scopeCost.max = ceilDate(new Date(scopeCost.max)).getTime();
    const scope = {
      min: ((scopeOrder.min > 0 && scopeOrder.min < scopeCost.min) || !scopeCost.min) ? scopeOrder.min : scopeCost.min,
      max: ((scopeOrder.max > 0 && scopeOrder.max > scopeCost.max) || !scopeCost.max) ? scopeOrder.max : scopeCost.max,
    };
    setDateScope(scope);

    if (!from && !to) {
      scope.min && scope.max && navigation.setParams({
        from: scope.max - scope.min < 5*31*24*60*60*1000 ? scope.min : floorMonth(new Date(scope.max-6*31*24*60*60*1000)).getTime(),
        to: scope.max,
      })
    } else {
      const revenue = await Repo.GetStatOrdersTotal(from, to);
      const costs = await Repo.GetStatCostsTotal(from, to);

      const newData = prepareData({revenue, costs});
      setData(newData);
    }

    setRefreshing(false);
  }, [route]);

  React.useEffect(() => { refresh() }, [route]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      {!!dateScope.min && <View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}>Период выборки</Text>
        <DateRange
          value={[from, to]}
          onChange={changeDateRange}
          min={dateScope.min}
          max={dateScope.max}
        />
      </View>}

      {(data.profit || []).length > 0 && <MultiLineChart
        lines={[
          {key: '1', color: '#41ff00', title: 'Чистая прибыль', data: data.profit},
          {key: '2', color: '#0007ff', title: 'Выручка', data: data.revenue},
          {key: '3', color: '#ff1200', title: 'Расходы', data: data.costs},
        ]}
      />}

      {!(data.profit || []).length && !refreshing &&
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
    paddingTop: 20,
    marginBottom: 20,
  }
});

export default Analytics1Screen
