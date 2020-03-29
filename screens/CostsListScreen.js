import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Repo from '../repository/repo';
import InfiniteScrollList from '../components/InfiniteScrollList';
import SearchFilterBar from '../components/SearchFilterBar';
import AddButton from '../components/AddButton';
import CostListItem from '../components/CostListItem';
import {moneyFormat} from '../helpers/number';

const perPage = 30;
const costListKeyExtractor = (item) => item.id.toString();

const CostsListScreen = ({route, navigation}) => {
  const {filters = {}, sort = []} = route.params ?? {};
  console.log('CostsListScreen route.params', route.params);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [totalRange, setTotalRange] = React.useState({});
  const [dateRange, setDateRange] = React.useState({});
  const [costs, setCosts] = React.useState([]);

  const refresh = React.useCallback(async () => {
    const models = await Repo.GetCosts({filters, sort, page: 1, limit: perPage});
    const range = await Repo.GetCostTotalRange();
    const datesRange = await Repo.GetCostCreatedAtRange();
    setCosts(models);
    setTotalRange(range);
    setDateRange(datesRange);
    setPage(2);
    setHasMore(true);
    console.log('refreshing')
  }, [filters, sort]);

  React.useEffect(() => {refresh()}, [route]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore) return;
    const options = {filters, sort, page: page, limit: perPage};
    setPage(page +1);
    // console.log('loadMore', options);
    let models = await Repo.GetCosts(options);
    if (models.length < perPage) {
      setHasMore(false);
    }
    setCosts((state) => state.concat(models));
    // console.log('loadMore complete', options);
  }, [hasMore, page, filters, sort]);

  const onPressCost = React.useCallback((item) => {
    navigation.navigate('Cost', {id: item.id})
  }, [navigation]);

  const renderCost = React.useCallback(({item}) => <CostListItem
    item={item}
    onPress={onPressCost}
  />, [onPressCost]);

  console.log('render', totalRange, costs);

  return (
    <View style={styles.container}>
      <InfiniteScrollList
        data={costs}
        renderItem={renderCost}
        keyExtractor={costListKeyExtractor}
        onRefresh={refresh}
        loadMore={loadMore}
        ListHeaderComponent={
          <SearchFilterBar
            filters={filters}
            options={{
              search: {field: 'comment'},
              filters: {
                total: {
                  type: 'rangeSlider',
                  label: 'Сумма',
                  ...totalRange,
                  text: values => `от ${moneyFormat(values[0])} до ${moneyFormat(values[1])} ₽`,
                },
                created_at: {
                  type: 'rangeDate',
                  ...dateRange,
                  label: 'Дата',
                }
              },
            }}
            onChange={(newFilters) => {
              // console.log('onValuesChangeFinish', newFilters);
              navigation.setParams({...(route.params || {}), filters: newFilters});
            }}
          />
        }
        ListFooterComponent={!hasMore && <Text style={{textAlign: 'center', paddingVertical: 30}}>Конец списка</Text>}
        ListEmptyComponent={page > 1 && <Text style={{textAlign: 'center', paddingVertical: 30}}>Нет расходов</Text>}
      />

      <AddButton onPress={()=>{navigation.navigate('CostCreate')}} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default CostsListScreen
