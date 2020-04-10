import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Overlay} from 'react-native-elements';

const ConfirmPopup = ({type, isVisible, title, okText, cancelText, onOk, onCancel}) => {
  const [processed, setProcessed] = React.useState(false);

  const _onOk = React.useCallback(async () => {
    setProcessed(true);
    await onOk();
    setProcessed(false);
  }, [onOk]);

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onCancel}
      overlayStyle={styles.container}
    >
      <View>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.btnGroup}>
          <Button
            title={okText}
            buttonStyle={btnTypeStyle(type)}
            loading={processed}
            disabled={processed}
            onPress={_onOk}
          />

          <Button
            type='outline'
            title={cancelText}
            buttonStyle={styles.btnCancel}
            onPress={onCancel}
          />
        </View>
      </View>
    </Overlay>
  )
};

function btnTypeStyle(type) {
  switch (type) {
    case 'danger':
      return styles.btnDanger;
    case 'default':
    default:
      return styles.btnDefault;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    height: 160,
  },
  title: {
    marginVertical: 30,
    textAlign: 'center',
    fontSize: 18,
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btnDefault: {
    paddingHorizontal: 20,
  },
  btnDanger: {
    paddingHorizontal: 20,
    backgroundColor: '#971114',
    borderColor: 'darkred',
  },
  btnCancel: {
    paddingHorizontal: 20,
  },
});

export default ConfirmPopup
