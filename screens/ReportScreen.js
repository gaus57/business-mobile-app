import React from 'react';
import {StyleSheet, ScrollView, RefreshControl, View, Text} from 'react-native';
import Repo from '../repository/repo';
import {ceilDate, floorDate, floorMonth} from '../helpers/date';
import DateRange from '../components/filters/DateRange';
import {Divider, ListItem} from 'react-native-elements';
import {moneyFormat} from '../helpers/number';

const ReportScreen = ({route, navigation}) => {
  const {from, to} = route.params || {};

  const [refreshing, setRefreshing] = React.useState(false);
  const [dataProducts, setDataProducts] = React.useState([]);
  const [revenueTotal, setRevenueTotal] = React.useState(0);
  const [costTotal, setCostTotal] = React.useState(0);
  const [dateScope, setDateScope] = React.useState({});

  const productsTotal = dataProducts.reduce((a, v) => a + v.y, 0);

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
        from: floorMonth(new Date(scope.max)).getTime(),
        to: scope.max,
      })
    } else {
      const rows = await Repo.GetStatProductsTotals(from, to);
      setDataProducts(rows);

      const revenue = await Repo.GetStatOrdersTotal(from, to);
      setRevenueTotal(revenue.reduce((agg, i) => agg+i.value, 0));
      const costs = await Repo.GetStatCostsTotal(from, to);
      setCostTotal(costs.reduce((agg, i) => agg+i.value, 0));
    }

    setRefreshing(false);
  }, [from, to]);

  React.useEffect(() => { refresh() }, [route]);

  const changeDateRange = React.useCallback((val) => {
    navigation.setParams({from: val[0], to: val[1]})
  }, [navigation]);

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

      {!revenueTotal && !costTotal && !refreshing &&
      <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет данных</Text>
      }

      {(!!revenueTotal || !!costTotal) && <View style={{marginTop: 20}}>
        <Divider />

        <ListItem
          title={'Чистая прибыль'}
          rightTitle={`${moneyFormat(revenueTotal - costTotal)} ₽`}
          containerStyle={{backgroundColor: 'transparent'}}
          titleStyle={{fontWeight: 'bold'}}
          bottomDivider
        />

        <ListItem
          title={'Расходы'}
          rightTitle={`${moneyFormat(costTotal)} ₽`}
          containerStyle={{backgroundColor: 'transparent'}}
          titleStyle={{fontWeight: 'bold'}}
          bottomDivider
        />

        <ListItem
          title={'Выручка'}
          rightTitle={`${moneyFormat(revenueTotal)} ₽`}
          containerStyle={{backgroundColor: 'transparent'}}
          titleStyle={{fontWeight: 'bold'}}
          bottomDivider
        />

        <ListItem
          title={'Стоимость товаров'}
          rightTitle={`${moneyFormat(productsTotal)} ₽`}
          containerStyle={{backgroundColor: 'transparent'}}
          titleStyle={{fontWeight: 'bold'}}
          bottomDivider
        />

        <ListItem
          title={'Товары:'}
          containerStyle={{backgroundColor: 'transparent'}}
          titleStyle={{fontWeight: 'bold'}}
          bottomDivider
        />

        {dataProducts.map(item => <ListItem
          key={item.id}
          title={item.label}
          rightTitle={`${moneyFormat(item.y)} ₽`}
          rightSubtitle={`${item.qty} ${item.unit.name}`}
          containerStyle={{backgroundColor: 'transparent'}}
          bottomDivider
        />)}
      </View>}

    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 20,
  }
});

export default ReportScreen
