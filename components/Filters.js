import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Colors from '../constants/Colors'
import Filter from "./Filter";

const Filters = ({filters}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.filtersLink}>Фильтры:</Text>
      {Object.entries(filters).map(([key, value]) => <Filter key={key} type={key} value={value} />)}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  filtersLink: {
    marginRight: 7,
    lineHeight: 25,
    color: Colors.linkColor,
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Filters
