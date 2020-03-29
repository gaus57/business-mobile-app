import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ceilDate, dateText, floorDate} from '../../helpers/date';

const pickerMode = 'date';

const DateRange = ({value = [], min, max, onChange}) => {
  const [showFrom, setShowFrom] = React.useState(false);
  const [showTo, setShowTo] = React.useState(false);

  const changeFrom = React.useCallback((event, selectedDate) => {
    setShowFrom(Platform.OS === 'ios');
    if (!selectedDate) return;
    onChange([floorDate(selectedDate).getTime(), value[1]]);
  }, [value]);

  const changeTo = React.useCallback((event, selectedDate) => {
    setShowTo(Platform.OS === 'ios');
    if (!selectedDate) return;
    onChange([value[0], ceilDate(selectedDate).getTime()]);
  }, [value]);

  return (
    <View style={styles.container}>
      <Text
        style={styles.field}
        onPress={()=>setShowFrom(true)}
      >{(value[0] && dateText(value[0])) || (min && dateText(min)) || 'с'}</Text>

      <Text
        style={styles.field}
        onPress={()=>setShowTo(true)}
      >{(value[1] && dateText(value[1])) || (max && dateText(max)) || 'по'}</Text>

      {showFrom && (
        <DateTimePicker
          value={new Date(value[0] || min)}
          minimumDate={min && new Date(min)}
          maximumDate={max && new Date(max)}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={changeFrom}
        />
      )}

      {showTo && (
        <DateTimePicker
          value={new Date(value[1] || max)}
          minimumDate={min && new Date(min)}
          maximumDate={max && new Date(max)}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={changeTo}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
  },
  field: {
    width: 90,
    paddingHorizontal: 10,
    lineHeight: 30,
    alignContent: 'center',
    backgroundColor: '#eee',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DateRange;
