import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

const Analytics1Screen = () => {
  return (
    <View style={styles.container}>
      <Text>Bezier Line Chart</Text>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }
          ]
        }}
        width={Layout.window.width} // from react-native
        height={220}
        yAxisLabel="₽"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          // backgroundColor: "#ffffff",
          fillShadowGradient: '#9f9c9f',
          backgroundGradientFrom: 'rgba(255,255,255,.99)',
          backgroundGradientTo: 'rgba(255,255,255,.99)',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "0",
            stroke: "#22ff28"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Analytics1Screen
