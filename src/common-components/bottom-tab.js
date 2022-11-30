import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import PropTypes from 'prop-types';
import {ComponentConstants} from '../constants/componentConstants';
import {ColorConstants} from '../constants/colorConstants';
import {images} from '../assets';

const styles = StyleSheet.create({
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#E9EBF3',
    shadowColor: '#E9EBF3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// const tabImages = {
//   home: IconConstants.HOME,
//   transportation: IconConstants.AMBULANCE,
//   delivery: IconConstants.SHIPPING_FAST,
//   interpretation: IconConstants.LANGUAGE,
//   payout: IconConstants.CALCULATOR,
//   settings: IconConstants.SETTING,
// };
const tabImages = {
  home: images.home_icon,
  transportation: images.transport_icon,
  delivery: images.delivery_icon,
  interpretation: images.language_icon,
  payout: images.payout_icon,
  settings: images.profile_icon,
};

const renderHeight = (type) => {
  switch (type) {
    case 'home':
      return 30;
    case 'transportation':
      return 25;
    case 'delivery':
      return 30;
    case 'interpretation':
      return 25;
    case 'payout':
      return 25;
    case 'settings':
      return 30;
    default:
      return 30;
  }
};
const renderWidth = (type) => {
  switch (type) {
    case 'home':
      return 30;
    case 'transportation':
      return 35;
    case 'delivery':
      return 30;
    case 'interpretation':
      return 25;
    case 'payout':
      return 25;
    case 'settings':
      return 30;
    default:
      return 30;
  }
};

const BottomTab = ({state, descriptors, navigation}) => {
  const renderLabel = (type) => {
    switch (type) {
      case ComponentConstants.HOME_SCREEN_NAME:
        return ComponentConstants.HOME_SCREEN_TITLE;
      case ComponentConstants.TRANSPORTATION_SCREEN_NAME:
        return ComponentConstants.TRANSPORTATION_SCREEN_TITLE;
      case ComponentConstants.DELIVERY_SCREEN_NAME:
        return ComponentConstants.DELIVERY_SCREEN_TITLE;
      case ComponentConstants.INTERPRETATION_SCREEN_NAME:
        return ComponentConstants.INTERPRETATION_SCREEN_TITLE;
      case ComponentConstants.PAYOUT_SCREEN_NAME:
        return ComponentConstants.PAYOUT_SCREEN_TITLE;
      case ComponentConstants.SETTING_SCREEN_NAME:
        return ComponentConstants.SETTING_SCREEN_TITLE;
      default:
        return ComponentConstants.HOME_SCREEN_TITLE;
    }
  };
  return (
    <View style={styles.ButtonContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            testID={options.tabBarTestID}
            onLongPress={onLongPress}
            accessibilityStates={isFocused ? ['selected'] : []}
            style={main}
            onPress={onPress}>
            <View
              style={[
                isFocused && {
                  borderTopWidth: 3,
                  borderTopColor: ColorConstants.GREEN,
                },
                {width: wp(6), alignItems: 'center'},
              ]}
            />
            {/* <Icon
              name={tabImages[label]}
              color={isFocused ? ColorConstants.GREEN : '#8A8E99'}
              size={20}
              style={{marginTop: hp(1.5)}}
            /> */}
            <Image
              source={tabImages[label]}
              style={{
                tintColor: isFocused ? ColorConstants.GREEN : '#8A8E99',
                height: renderHeight(label),
                width: renderWidth(label),
                marginTop: hp(1.5),
              }}
            />

            {isFocused ? (
              <Text
                numberOfLines={1}
                style={[
                  focused,
                  {
                    color: isFocused
                      ? ColorConstants.GREEN
                      : ColorConstants.BLACK,
                  },
                ]}>
                {renderLabel(label)}
              </Text>
            ) : (
              <Text style={unfocused} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

BottomTab.propTypes = {
  state: PropTypes.shape(PropTypes.object),
};
BottomTab.defaultProps = {
  state: 'Search here',
};
const unfocused = {
  marginTop: hp(1),
  textAlign: 'center',
  width: wp(16),
  fontSize: 10,
};
const focused = {
  marginTop: hp(1),
  textAlign: 'center',
  width: wp(16),
  fontSize: 12,
};
const main = {alignItems: 'center', justifyContent: 'center'};

export default BottomTab;
