import {Platform, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

export const LoginStyles = StyleSheet.create({
  logo: {
    width: wp('40%'),
    height: hp('16%'),
  },
  loginHeaderImage: {
    width: wp('50%'),
    height: hp('18%'),
    alignContent: 'center',
  },
  partnerText: {
    fontSize: hp('2%'),
    color: ColorConstants.BLUE,
    marginVertical: hp(2),
  },
  inputBox: {
    marginTop: hp('-2%'),
    bottom: hp('18%'),
  },
  helperText: {
    marginLeft: wp('5%'),
  },
  buttonGroup: {
    zIndex: 2,
    flexDirection: 'row',
    borderRadius: wp('50%'),
    backgroundColor: ColorConstants.WHITE,
    marginLeft: wp('55%'),
    width: wp('30%'),
    paddingLeft: wp('4%'),
    marginVertical: hp('5%'),
    alignItems: 'center',
    height: wp('10%'),
    position: 'absolute',
    bottom: hp('2%'),
  },
  signInButton: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    color: ColorConstants.GREEN,
    height: wp('10%'),
  },
  signInButtonText: {
    zIndex: 1,
    fontSize: hp('2%'),
    color: ColorConstants.GREEN,
  },
  chevronRight: {
    zIndex: 2,
    color: ColorConstants.GREEN,
    marginLeft: wp('5%'),
  },
  passwordTouchable: {
    zIndex: 2,
    color: ColorConstants.DARKGRAY,
    bottom: Platform.OS == 'ios' ? hp('7%') : hp('8%'),
    marginLeft: wp('84%'),
  },
  signUpText: {
    fontSize: 16,
    color: ColorConstants.WHITE,
    bottom: Platform.OS == 'ios' ? hp('8%') : hp('9%'),
    marginLeft: wp('18%'),
  },
  forgotPassword: {
    bottom: hp('4%'),
    marginHorizontal: wp('8%'),
    fontSize: 14,
    color: ColorConstants.GREEN,
  },
  faceId: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginBottom: hp(1),
    tintColor: ColorConstants.BLUE,
  },
});
