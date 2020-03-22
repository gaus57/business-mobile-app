import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import Colors from "../constants/Colors";

const Filter = ({type, value}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.type}>{typeText(type)}:</Text>
      <Text style={styles.value}>{valueText(type, value)}</Text>
    </View>
  )
};

function typeText(type) {
  switch (type) {
    case 'date':
      return 'дата';
    case 'sum':
      return 'сумма';
    case 'status':
      return 'статус';
  }
}

function valueText(type, value) {
  switch (type) {
    case 'date':
      return rangeValue(value, 'с', 'по');
    case 'sum':
      return rangeValue(value, 'от', 'до');
    case 'status':
      return value.join(', ');
  }
}

function rangeValue(values, textFrom, textTo) {
  let [from, to] = values;
  if (!from) {
    return `${textTo} ${to}`;
  } else if (!to) {
    return `${textFrom} ${from}`;
  } else {
    return `${textFrom} ${from} ${textTo} ${to}`;
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  type: {
    lineHeight: 25,
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    lineHeight: 25,
    paddingLeft: 4,
    fontSize: 16,
  },
});

export default Filter
