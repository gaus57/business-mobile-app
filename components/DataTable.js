import React from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";

const DataTable = ({keyField, columns, data, onPressItem}) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {columns.map((item) => (
          <View key={item.key} style={{...styles.headerCol, flexGrow: item.size || 1}}>
            <Text style={styles.headerText}>{item.title}</Text>
          </View>
        ))}
      </View>

      {data.map((row) => (
        <TouchableOpacity key={row[keyField]} onPress={() => { onPressItem(row) }} style={styles.row}>
          {columns.map((col) => (
            <View key={col.key} style={{...styles.col, flexGrow: col.size || 1}}>
              <Text style={styles.text}>{col.value ? col.value(row) : row[col.key]}</Text>
            </View>
          ))}
        </TouchableOpacity>
      ))}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  headerCol: {
    flex: 1,
    margin: 2,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: Colors.tableHeaderBackground,
  },
  col: {
    flex: 1,
    margin: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  headerText: {
    fontWeight: 'bold',
  },
  text: {

  },
});

export default DataTable
