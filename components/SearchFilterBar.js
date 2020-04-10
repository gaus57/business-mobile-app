import React from 'react';
import {View, Text} from 'react-native';
import {Card, CheckBox, Divider, Icon, Overlay, SearchBar} from 'react-native-elements';
import Slider from './filters/Slider';
import layout from '../constants/Layout';
import DateRange from './filters/DateRange';

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
        overlayStyle={{padding: 20}}
      >
        <View>
          <Text style={{marginBottom: 15, fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Фильтры</Text>

          <Divider />

          {Object.entries(options.filters).map(([key, val], i) => {
            return (
              <Filter
                key={key}
                value={filters[key]}
                options={val}
                onChange={(value) => {
                  onChange({...filters, [key]: value});
                }}
              />
            )
          })}
        </View>
      </Overlay>
    </>
  )
};

const Filter = ({value, options = {}, onChange}) => {
  const FilterType = filtersMap[options.type];
  if (FilterType === undefined) {
    throw new Error(`Unsupported filter type: ${options.type}`)
  }
  const Filter = FilterType({...options, value, onChange});
  if (!Filter) {
    return null
  }

  return (
    <View>
      {options.label &&
        <Text style={{fontSize: 16, marginVertical: 10, textAlign: 'center'}}>{options.label}</Text>
      }

      {Filter}

      <Divider style={{marginTop: 10}} />
    </View>
  )
};

const RangeSlider = ({value, onChange, min, max, text}) => {
  if (!(min >= 0 && max >= 0) || min === max) {
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

const RangeDate = ({value, onChange, min, max}) => {
  if (!(min >= 0 && max >= 0) || min === max) {
    return null;
  }

  return (
    <View style={{paddingBottom: 15}}>
      <DateRange
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
    </View>
  )
};

const Checkbox = ({value, text, onChange}) => {

  return (
    <CheckBox
      title={text}
      checked={!!value}
      onPress={() => { onChange(!value) }}
      containerStyle={{marginTop: 15, backgroundColor: 'transparent', borderWidth: 0}}
    />
  )
};

const filtersMap = {
  'rangeSlider': RangeSlider,
  'rangeDate': RangeDate,
  'checkbox': Checkbox,
};

export default React.memo(SearchFilterBar);
