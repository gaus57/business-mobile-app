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
    this.setState({
      keyboardOffset: event.endCoordinates.height,
    })
  };

  _keyboardDidHide = () => {
    this.setState({
      keyboardOffset: 0,
    })
  };

  render() {
    const {children, style = {}, dopMargin = 0, ...props} = this.props;
    const marginBottom = (style.marginBottom || 0) + this.state.keyboardOffset + (!!this.state.keyboardOffset && dopMargin);

    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
        style={{...style, marginBottom}}
        {...props}
      >
        {children}
      </ScrollView>
    )
  }
}
