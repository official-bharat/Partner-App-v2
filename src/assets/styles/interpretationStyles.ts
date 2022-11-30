import {StyleSheet, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

export const InterpretationStyles = StyleSheet.create({
  menuText: {
    color: ColorConstants.DARKGRAY,
    paddingLeft: 12,
  },
  menuView: {
    flexDirection: 'row',
    borderColor: ColorConstants.GREEN,
    borderRadius: 10,
    borderWidth: 2,
    height: 35,
    alignItems: 'center',
    marginRight: wp(1),
  },
  menuAction: {
    marginRight: wp('-1'),
  },
  appbarContent: {
    marginLeft: Platform.OS === 'ios' ? wp('-30%') : 0,
  },
  circleLeft: {
    borderRadius: wp('50%'),
    borderWidth: wp('6%'),
    borderColor: ColorConstants.LIGHT_GREEN,
    zIndex: 1,
    height: hp('5%'),
    width: wp('5%'),
    margin: wp('2%'),
  },
  iconLeft: {
    top: wp('-2.5%'),
    left: wp('-2.5%'),
    zIndex: 2,
    position: 'absolute',
  },
  icons: {
    marginHorizontal: wp(1),
    marginVertical: hp(0.3),
  },
  circleRight: {
    borderRadius: wp('50%'),
    borderWidth: wp('2%'),
    borderColor: ColorConstants.LIGHT_GREEN,
    zIndex: 1,
    height: hp('1%'),
    width: wp('1%'),
    margin: wp('0.5%'),
    marginVertical: wp('6%'),
  },
});
