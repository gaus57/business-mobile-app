import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import Layout from '../constants/Layout';

const Analytics2Screen = () => {
  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        width={Layout.window.width}
        height={220}
        chartConfig={{
          backgroundColor: '#022173',
          backgroundGradientFrom: '#022173',
          backgroundGradientTo: '#1b3fa0',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          hasLegend: false,
        }}
        hasLegend={false}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  )
};

const data = [
  {
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Beijing",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "New York",
    population: 8538000,
    color: "#ffffff",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Moscow",
    population: 11920000,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Analytics2Screen
