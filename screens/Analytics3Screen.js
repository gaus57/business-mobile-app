import React from 'react';
import {Text, StyleSheet, ScrollView, RefreshControl, ToastAndroid} from 'react-native';
import Repo from '../repository/repo';
import MultiLineZoomChart from '../components/chart/MultiLineZoomChart';
import {Button, Overlay} from 'react-native-elements';
import ProductList from '../components/ProductsList';

const colors = [
  '#ff1200',
  '#41ff00',
  '#0007ff',
  '#fff100',
  '#00fff3',
  '#d500ff',
];

const Analytics3Screen = ({route, navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [lines, setLines] = React.useState([]);
  const [showProductPicker, setShowProductPicker] = React.useState(false);

  const {ids = []} = route.params || {};
  const dataLength = lines.reduce((agg, line) => agg + (line.data || []).length, 0);

  const refresh = React.useCallback(async () => {
    setRefreshing(true);

    const stat = await Repo.GetStatProductTotals(ids);
    const data = prepareLines(stat);

    setLines(data);

    setRefreshing(false);
  }, [ids]);

  React.useEffect(() => {
    refresh();
  }, [route]);

  const isChecked = React.useCallback(p => {
    return ids.includes(p.id)
  }, [ids]);

  const check = React.useCallback(p => {
    let newIds = [...ids];
    let i = newIds.indexOf(p.id);
    if (i !== -1) {
      newIds.splice(i, 1)
    } else {
      newIds.push(p.id);
    }
    // if (newIds.length > 6) {
    //   ToastAndroid.show('Расход сохранен', ToastAndroid.SHORT);
    // }
    navigation.setParams({ids: newIds})
  }, [navigation, ids]);

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        style={styles.container}
      >
        <Button
          title="Выбрать товары"
          type="outline"
          onPress={() => {setShowProductPicker(true)}}
          containerStyle={{marginVertical: 15, marginHorizontal: 30}}
        />

        {!dataLength && !refreshing &&
          <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет данных</Text>
        }

        <MultiLineZoomChart
          lines={lines}
        />
      </ScrollView>

      <Overlay
        isVisible={showProductPicker}
        onBackdropPress={() => {setShowProductPicker(false)}}
        overlayStyle={{padding: 0}}
      >
        <ProductList
          sort={['name']}
          onPresItem={check}
          isChecked={isChecked}
        />
      </Overlay>
    </>
  )
};

function prepareLines(stat) {
  const lines = {};
  const dates = {};
  for (let item of stat) {
    let i = item.product_id;
    let key = [item.month, item.year].join('.');
    if (!lines[i]) {
      lines[i] = {
        key: item.product_id,
        title: item.product.name,
        product: item.product,
        data: {},
      }
    }
    let d = new Date(`${item.month}/01/${item.year}`);
    dates[key] = d;
    lines[i].data[key] = {x: d, y: item.total };
  }

  for (let key in dates) {
    for (let i in lines) {
      if (!lines[i].data[key]) {
        lines[i].data[key] = {x: dates[key], y: 0};
      }
    }
  }

  return Object.values(lines).map((line, i) => ({...line, color: colors[i], data: Object.values(line.data)}));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Analytics3Screen
