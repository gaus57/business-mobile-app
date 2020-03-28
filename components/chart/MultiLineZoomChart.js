import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  VictoryTheme,
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
  VictoryBrushContainer,
  VictoryZoomContainer,
  VictoryLegend,
  VictoryTooltip,
  VictoryLabel
} from 'victory-native';
import Layout from '../../constants/Layout';
import {moneyFormat} from '../../helpers/number';

const defaultZoomInterval = 1000*60*60*24*183; // пол года

const MultiLineZoomChart = ({lines = []}) => {
  if (lines.length === 0) {
    return null;
  }

  const [selectedDomain, setSelectedDomain] = React.useState();
  const [zoomDomain, setZoomDomain] = React.useState();

  const select = React.useCallback((domain) => {
    console.log('zoomDomain', domain);
    setZoomDomain(domain);
    setSelectedDomain(domain);
  }, [lines]);

  React.useEffect(() => {
    const newZoom = selectDefaultDomain(lines);

    if (newZoom) {
      setZoomDomain(newZoom);
      setSelectedDomain(newZoom);
    }
  }, [lines]);

  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        width={Layout.window.width}
        height={350}
        padding={{left: 60, top: 20, right: 20, bottom: 50}}
        scale={{x: "time"}}
        containerComponent={
          <VictoryZoomContainer
            responsive={false}
            zoomDimension="x"
            zoomDomain={zoomDomain}
          />
        }
      >
        <VictoryAxis
          crossAxis
          tickFormat={tickX}
          style={{
            grid: {stroke: "#ddd"},
          }}
        />
        <VictoryAxis
          tickFormat={tickY}
          crossAxis
          dependentAxis
          style={{
            grid: {stroke: "#ddd"},
          }}
        />

        {lines.map(line => line && line.data && line.data.length > 0 && <VictoryLine
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
      </VictoryChart>

      <VictoryChart
        padding={{top: 0, left: 20, right: 20, bottom: 70 + 32*lines.length}}
        width={Layout.window.width}
        height={110 + 32*lines.length}
        scale={{x: "time"}}
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryBrushContainer
            responsive={false}
            brushDimension="x"
            brushDomain={selectedDomain}
            onBrushDomainChange={select}
          />
        }
      >
        <VictoryAxis />

        {lines.map(line => line && line.data && line.data.length > 0 && <VictoryLine
          key={line.key}
          style={{
            data: {stroke: line.color, strokeWidth: 1},
          }}
          interpolation='monotoneX'
          data={line.data}
        />)}

        <VictoryLegend
          x={20} y={90}
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

function selectDefaultDomain(lines, selectedDomain) {
  const dates = [].concat(...lines.map(line => [...(line.data || []).map(item => item.x.getTime())])).sort();
  if (dates.length <= 2) {
    return null;
  }

  const minX = dates[0];
  const maxX = dates[dates.length - 1];
  let newZoom = {};
  let changed = false;

  if (selectedDomain && selectedDomain.x) {
    newZoom = {...selectedDomain};
    if (newZoom.x[1].getTime() > maxX) {
      newZoom.x[1] = new Date(maxX);
      changed = true;
    }
    if (newZoom.x[0].getTime() < minX) {
      newZoom.x[0] = new Date(minX);
      changed = true;
    }
  } else if (maxX - minX > defaultZoomInterval) {
    newZoom = {
      x: [
        new Date(maxX - defaultZoomInterval),
        new Date(maxX),
      ],
    };
    changed = true;
  }

  return changed ? newZoom : null;
}

function tickX(t) {
  if (t.getMonth() === 0) {
    return t.getFullYear();
  } else {
    let m = t.getMonth() + 1;
    return `${m < 10 ? '0' : ''}${m}`;
  }
}

function tickY(t) {
  if (t >= 1000) {
    return `${Math.round(t/1000)} т.₽`;
  }
  return `${Math.round(t)} ₽`;
}

export default React.memo(MultiLineZoomChart);
