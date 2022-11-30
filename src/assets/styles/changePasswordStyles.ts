import {StyleSheet, Platform} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

export const ChangePasswordStyles = StyleSheet.create({
  inputBox: {
    top: hp('1%'),
    paddingHorizontal: wp('8%'),
  },
  action: {
    marginBottom: hp('2%'),
    marginTop: hp('-3%'),
    top: hp('6%'),
    width: wp('96%'),
    right: wp('5%'),
  },
  passwordTouchable: {
    color: ColorConstants.DARKGRAY,
    bottom: Platform.OS == 'ios' ? hp('7%') : hp('8%'),
    marginLeft: wp('76%'),
  },
  helperText: {
    marginLeft: wp('5%'),
  },
  footerView: {
    height: hp('65%'),
  },
  footerImage: {
    zIndex: 1,
    width: wp('100%'),
    height: hp('30%'),
    position: 'absolute',
    bottom: hp(18),
  },
  buttonGroup: {
    borderRadius: 40,
    backgroundColor: ColorConstants.WHITE,
    alignSelf: 'flex-end',
    paddingHorizontal: wp(10),
    alignItems: 'center',
    marginTop: hp('30%'),
    zIndex: 99,
    marginRight: wp(3),
  },
  changePasswordButton: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    color: ColorConstants.GREEN,
    height: wp('10%'),
  },
  changePasswordText: {
    zIndex: 1,
    fontSize: hp('2%'),
    color: ColorConstants.GREEN,
  },
  chevronRight: {
    zIndex: 2,
    color: ColorConstants.GREEN,
    marginLeft: wp('2%'),
  },
});
