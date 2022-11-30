import React from 'react';
import {CommonStyles} from '../assets/styles/commonStyles';
import RNPickerSelect from 'react-native-picker-select';
import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export default class DropdownFull extends React.Component<DrodownProperty> {
  constructor(props: Readonly<any>) {
    super(props);
  }
  render() {
    return (
      <>
        <RNPickerSelect
          value={this.props.defaultValue}
          useNativeAndroidPickerStyle={false}
          onValueChange={this.props.onSelect}
          style={stylesPicker}
          items={this.props.items}
          placeholder={{
            label: this.props.placeholder,
          }}
        />
      </>
    );
  }
}

interface DrodownProperty {
  items: Array<{label: string; value: any}>;
  placeholder: string;
  defaultValue: string;
  onSelect?: ((value: string, index: number) => void) | undefined;
}

const stylesPicker = StyleSheet.create({
  placeholder: {
    color: 'rgba(0,0,0,.7)',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'normal',
    paddingLeft: widthPercentageToDP(3),
  },
  inputIOS: CommonStyles.dropdownV2Picker,
  inputAndroid: CommonStyles.dropdownV2Picker,
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
  },
  viewContainer: {
    marginTop: heightPercentageToDP(1),
  },
});
