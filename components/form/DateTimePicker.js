import * as React from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import BaseDateTimePicker from '@react-native-community/datetimepicker';

const DateTimePicker = ({label, value, error, onChange}) => {
  const date = new Date(value);
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const onDateChange = React.useCallback((event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (mode === 'date') {
      date.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    }
    if (mode === 'time') {
      date.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    }
    onChange(date.getTime());
  }, [mode, date]);

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = React.useCallback(() => {
    showMode('date');
  }, []);

  const showTimepicker = React.useCallback(() => {
    showMode('time');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            onPress={showDatepicker}
            style={styles.value}
          >{date.toLocaleDateString()}</Text>

          <Text
            onPress={showTimepicker}
            style={styles.value}
          >{date.toLocaleTimeString()}</Text>
      </View>
      {show && (
        <BaseDateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 20,
    borderStyle: 'solid',
    borderBottomColor: '#aaa',
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a98aa',
  },
  value: {
    padding: 5,
    lineHeight: 26,
    fontSize: 16,
  },
});

export default DateTimePicker
