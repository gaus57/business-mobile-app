import React from 'react';
import {View} from 'react-native';
import {Card, Icon, Overlay, SearchBar} from 'react-native-elements';
import Slider from './filters/Slider';
import layout from '../constants/Layout';

const SearchFilterBar = ({filters = {}, options, onChange}) => {
  const [isShowFilters, setIsShowFilters] = React.useState(false);

  const showFilters = React.useCallback(() => {setIsShowFilters(true)}, []);
  const hideFilters = React.useCallback(() => {setIsShowFilters(false)}, []);

  return (
    <>
      <View>
        <SearchBar
          placeholder="Поиск..."
          value={filters[options.search.field] || ''}
          lightTheme
          containerStyle={{paddingLeft: 55, zIndex: 10}}
          onChangeText={(val) => {
            onChange({...filters, [options.search.field]: val});
          }}
        />
        <Icon
          name='md-options'
          type='ionicon'
          size={30}
          onPress={showFilters}
          containerStyle={{position: 'absolute', left: 0, top: 0, padding: 15, zIndex: 20}}
        />
      </View>

      <Overlay
        isVisible={isShowFilters}
        onBackdropPress={hideFilters}
        overlayStyle={{padding: 0}}
      >
        <Card title='Фильты' containerStyle={{margin: 0, borderWidth: 0}}>
          {Object.entries(options.filters).map(([key, val]) => {
            return <Filter
              key={key}
              value={filters[key]}
              options={val}
              onChange={(value) => {
                onChange({...filters, [key]: value});
              }}
            />
          })}
        </Card>
      </Overlay>
    </>
  )
};

const Filter = ({value, options = {}, onChange}) => {
  const FilterType = filtersMap[options.type];
  if (FilterType === undefined) {
    throw new Error(`Unsupported filter type: ${options.type}`)
  }
  return <FilterType value={value} onChange={onChange} {...options} />
};

const RangeSlider = ({value, onChange, min, max, text}) => {
  if (!min || !max) {
    return null;
  }

  if (!value) {
    value = [min, max];
  }

  return (
    <Slider
      values={value}
      min={min}
      max={max}
      title={text}
      sliderLength={layout.window.width * .65}
      onChange={onChange}
    />
  )
};

const filtersMap = {
  'rangeSlider': RangeSlider,
};

export default React.memo(SearchFilterBar);
