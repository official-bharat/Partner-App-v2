import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

const logo = require('../images/logo.png');

const footerImage = require('../images/splash-bg.png');

const loginHeader = require('../images/login-header.png');

const TextInputTheme = {
  colors: {text: ColorConstants.BLACK, primary: ColorConstants.GREEN},
};

const HeaderTheme = {
  colors: {text: ColorConstants.BLACK, primary: ColorConstants.WHITE},
};

const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorConstants.WHITE,
    // height: hp('100%')
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    bottom: hp(5),
    height: hp('25%'),
    width: wp('55%'),
  },
  footerImage: {
    zIndex: 1,
    width: wp('100%'),
    height: hp('22%'),
    bottom: 0,
    position: 'absolute',
  },
  rectangle: {
    width: wp(40),
    height: hp(7),
    borderRadius: wp(80),
    backgroundColor: ColorConstants.WHITE,
    bottom: hp(8),
    marginLeft: wp(46),
  },
  splashText: {
    width: wp(90),
    height: hp(13),
    fontSize: hp(3),
    lineHeight: hp(3.5),
    color: ColorConstants.BLACK,
    marginBottom: hp('25%'),
    marginHorizontal: wp('5%'),
  },
  signInWithYourAccount: {
    width: wp(80),
    height: hp(5),
    fontSize: hp(2.5),
    textAlign: 'left',
    color: ColorConstants.DARKGRAY,
    bottom: hp(38),
    marginLeft: wp(5),
  },
  loader: {
    position: 'absolute',
    zIndex: 2,
    marginVertical: hp('50%'),
    marginHorizontal: wp('50%'),
  },
  textInput: {
    backgroundColor: ColorConstants.WHITE,
    borderColor: ColorConstants.GRAY,
    color: ColorConstants.GRAY,
    marginHorizontal: wp('8%'),
  },
  textInputWithoutMargin: {
    backgroundColor: ColorConstants.WHITE,
    borderColor: ColorConstants.GRAY,
    color: ColorConstants.GRAY,
  },
  buttonGroup: {
    borderRadius: wp('50%'),
    backgroundColor: ColorConstants.WHITE,
    marginLeft: wp('50%'),
    width: wp('38%'),
    marginVertical: hp('5%'),
    alignItems: 'center',
  },
  signInButton: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    color: ColorConstants.GREEN,
  },
  signInButtonText: {
    marginVertical: hp('1%'),
    fontSize: hp('2%'),
    color: ColorConstants.GREEN,
  },
  chevronRight: {
    color: ColorConstants.GREEN,
    marginLeft: wp('5%'),
  },
  inputBox: {
    marginBottom: hp('2%'),
    marginTop: hp('-2%'),
    bottom: hp('18%'),
  },
  waitinTimeInput: {
    zIndex: 2,
    backgroundColor: ColorConstants.WHITE,
    borderColor: ColorConstants.GRAY,
    color: ColorConstants.GRAY,
    textAlign: 'center',
    marginVertical: wp('1.8%'),
    width: wp('20%'),
    height: hp('7%'),
  },

  dropdownPicker: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
    marginBottom: 10,
    padding: hp(1.5),
    width: wp('80%'),
  },
  dropdownV2Picker: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderWidth: 0.7,
    borderColor: '#000',
    color: '#000',
    fontSize: 14,
    fontStyle: 'normal',
    padding: hp(2),
  },
});

export {
  CommonStyles,
  logo,
  footerImage,
  loginHeader,
  TextInputTheme,
  HeaderTheme,
};
