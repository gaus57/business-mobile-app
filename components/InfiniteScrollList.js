import React from 'react';
import {FlatList} from 'react-native';

const InfiniteScrollList = ({
  data = [],
  renderItem,
  keyExtractor,
  onRefresh,
  loadMore,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  React.useLayoutEffect(() => {
    setRefreshing(refreshing);
  }, [refreshing]);

  const refresh = React.useCallback(() => {
    async function run() {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    run();
  }, [onRefresh]);

  const onEndReached = React.useCallback(() => {
    async function run() {
      setLoadingMore(true);
      await loadMore();
      setLoadingMore(false);
    }
    !loadingMore && run();
  }, [loadingMore, loadMore]);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      renderItem={renderItem}
      onRefresh={refresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      initialNumToRender={10}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  )
};

export default InfiniteScrollList;
