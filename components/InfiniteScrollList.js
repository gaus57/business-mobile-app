import React from 'react';
import {FlatList} from 'react-native';

const InfiniteScrollList = ({
  onEndReached,
  ...props
}) => {
  const [loadingMore, setLoadingMore] = React.useState(false);

  const _onEndReached = React.useCallback(() => {
    async function run() {
      setLoadingMore(true);
      await onEndReached();
      setLoadingMore(false);
    }
    !loadingMore && run();
  }, [loadingMore, onEndReached]);

  return (
    <FlatList
      {...props}
      onEndReached={_onEndReached}
      onEndReachedThreshold={3}
      initialNumToRender={10}
    />
  )
};

export default InfiniteScrollList;
