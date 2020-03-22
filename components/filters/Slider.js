import * as React from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Text, View} from 'react-native';

const Slider = ({values, onChange, sliderLength, min, max, title}) => {
  if (min === undefined || max === undefined || min === max) {
    return null;
  }

  const [range, setRange] = React.useState();

  React.useEffect(() => {
    !range && setRange([min, max]);
  }, [min, max]);

  React.useEffect(() => {
    values && setRange(values);
  }, [values]);

  return (
    <View style={{alignItems: 'center'}}>
      <Text style={{fontSize: 18}}>{range && title(range)}</Text>

      {range && <MultiSlider
        values={range}
        min={min}
        max={max}
        sliderLength={sliderLength}
        containerStyle={{}}
        onValuesChange={(values) => {
          setRange(values);
        }}
        onValuesChangeFinish={onChange}
      />}
    </View>
  )
};

export default Slider
