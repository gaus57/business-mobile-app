import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {VictoryPie, VictoryLabel, VictoryTheme} from 'victory-native';
import Svg from 'react-native-svg';
import Repo from '../repository/repo';
import {ListItem} from 'react-native-elements';
import Layout from '../constants/Layout';
import DateRange from '../components/filters/DateRange';
import {ceilDate, floorDate} from '../helpers/date';
import {moneyFormat} from '../helpers/number';

const Analytics2Screen = ({route, navigation}) => {
  const {from, to} = route.params || {};

  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dateScope, setDateScope] = React.useState({});

  const total = data.reduce((a, v) => a + v.y, 0);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const scope = await Repo.GetOrderCreatedAtRange();
    if (scope.min) scope.min = floorDate(new Date(scope.min)).getTime();
    if (scope.max) scope.max = ceilDate(new Date(scope.max)).getTime();
    setDateScope(scope);

    const rows = await Repo.GetStatProductsTotals(from, to);
    setData(rows.map((item, i) => ({...item, x: i+1})));

    setRefreshing(false);
  }, [from, to]);

  React.useEffect(() => {
    refresh();
  }, [route]);

  const changeDateRange = React.useCallback((val) => {
    navigation.setParams({from: val[0], to: val[1]})
  }, [navigation]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      style={styles.container}
    >
      <View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}>Период выборки</Text>
        <DateRange
          value={[from, to]}
          onChange={changeDateRange}
          min={dateScope.min}
          max={dateScope.max}
        />
      </View>

      {!data.length && !refreshing &&
        <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет данных</Text>
      }

      <Svg width={Layout.window.width} height={300}>
        {data.length > 0 && <VictoryPie
          width={Layout.window.width}
          height={300}
          padAngle={2}
          radius={100}
          innerRadius={60}
          data={data}
          animate={{
            duration: 2000
          }}
          theme={VictoryTheme.material}
          // colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
        />}
        {total > 0 && <VictoryLabel
          text={`${total} ₽`}
          x={Layout.window.width / 2}
          y={150}
          textAnchor='middle'
          style={{fontSize: 18}}
        />}
      </Svg>

      <View>
        {data.map(item => <ListItem
          key={item.id}
          title={item.label}
          subtitle={`${item.qty} ${item.unit.name}`}
          rightTitle={`${Math.round(item.y/total*10000)/100} %`}
          rightSubtitle={`${moneyFormat(item.y)} ₽`}
          containerStyle={{backgroundColor: 'transparent'}}
          bottomDivider
        />)}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  }
});

export default Analytics2Screen
