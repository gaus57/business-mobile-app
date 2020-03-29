import React from 'react';
import {ScrollView, Keyboard} from 'react-native';

export default class ScrollViewKeyboardFix extends React.Component {
  state = {
    keyboardOffset: 0,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    Keyboard.removeListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    Keyboard.removeListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  _keyboardDidShow = (event) => {
    console.log('keyboardDidShow', event.endCoordinates.height);
    this.setState({
      keyboardOffset: event.endCoordinates.height,
    })
  };

  _keyboardDidHide = () => {
    console.log('keyboardDidHide');
    this.setState({
      keyboardOffset: 0,
    })
  };

  render() {
    const {children, style = {}, ...props} = this.props;
    console.log('render scroll', {...style, marginBottom: (style.marginBottom || 0) + this.state.keyboardOffset});
    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
        style={{...style, marginBottom: (style.marginBottom || 0) + this.state.keyboardOffset}}
        {...props}
      >
        {children}
      </ScrollView>
    )
  }
}
