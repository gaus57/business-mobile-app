import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Своё дело</Text>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.menuButtonText}>Продажи</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Products')}>
        <Text style={styles.menuButtonText}>Товары</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Costs')}>
        <Text style={styles.menuButtonText}>Расходы</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Reports')}>
        <Text style={styles.menuButtonText}>Отчеты</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.menuButtonText}>Аналитика</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  title: {
    paddingVertical: 20,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#73be2d',
    textAlign: 'center',
  },
  menuButton: {
    height: 80,
    marginLeft: 32,
    marginRight: 32,
    textAlign: 'center',
    backgroundColor: '#ccc',
  },
  menuButtonText: {
    lineHeight: 80,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
