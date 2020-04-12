import React from 'react';
import {View} from 'react-native';
import {
  VictoryTheme,
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
  VictoryLegend,
  VictoryLabel,
} from 'victory-native';
import Layout from '../../constants/Layout';
import {ruMonth} from '../../helpers/date';

const MultiLineZoomChart = ({lines = []}) => {
  if (!lines.length) {
    return null;
  }

  let tickValues = lines.reduce((agg, line) => agg.concat(line.data.map(i => i.x)), []);
  const tickMap = {};
  for (let tick of tickValues) {
    tickMap[tick.toString()] = tick;
  }
  tickValues = Object.values(tickMap);
  console.log(tickValues);
  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        width={Layout.window.width}
        height={360 + 32*lines.length}
        padding={{left: 60, top: 20, right: 20, bottom: 50 + 32*lines.length}}
        scale={{x: "time"}}
      >
        <VictoryAxis
          crossAxis
          tickFormat={tickX}
          style={{
            grid: {stroke: "#ddd"},
          }}
          tickValues={tickValues.length <= 6 ? tickValues : null}
          tickLabelComponent={<VictoryLabel angle={tickValues.length > 6 ? -30 : 0}/>}
        />
        <VictoryAxis
          tickFormat={tickY}
          crossAxis
          dependentAxis
          style={{
            grid: {stroke: "#ddd"},
          }}
        />

        {lines.map(line => line && line.data && line.data.length > 1 && <VictoryLine
          key={'l'+line.key}
          style={{
            data: {stroke: line.color, strokeWidth: 2},
          }}
          interpolation='monotoneX'
          data={line.data}
        />)}

        {lines.map(line => line && line.data && line.data.length > 0 && <VictoryScatter
          key={'s'+line.key}
          data={line.data}
          size={3}
          style={{
            data: { fill: line.color},
            labels: {},
          }}
          // labelComponent={<VictoryLabel dy={({index}) => index%2 ? -5 : 15}/>}
          // labels={({ datum }) => moneyFormat(datum.y)}
        />)}

        <VictoryLegend
          x={20} y={350}
          padding={{top: 0, left: 0, right: 0, bottom: 20}}
          orientation="vertical"
          symbolSpacer={5}
          gutter={20}
          data={lines.map(line => ({
            name: line.title,
            symbol: {fill: line.color},
            labels: {fontSize: 16, lineHeight: 1.5},
          }))}
        />
      </VictoryChart>
    </View>
  )
};

function tickX(t) {
  if (t.getMonth() === 0) {
    return t.getFullYear();
  } else {
    return ruMonth(t);
  }
}

function tickY(t) {
  if (t >= 9000 && !(t%1000)) {
    return `${Math.round(t/1000)} т.₽`;
  }
  return `${Math.round(t)} ₽`;
}

export default React.memo(MultiLineZoomChart);
