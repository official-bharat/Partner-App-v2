import {StyleSheet, Dimensions} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorConstants.WHITE,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  welcomeText: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: hp('4%'),
  },
  header: {
    height: hp('35%'),
    padding: 16,
  },
  headerImage: {
    // height: '100%',
    width: wp(90),
    height: hp(25.5),
    alignSelf: 'center',
    marginTop: hp(3),
  },
  headerImageText: {
    top: hp('9%'),
    textAlign: 'center',
    color: ColorConstants.DARKGRAY,
    paddingLeft: wp('15%'),
    paddingRight: wp('10%'),
  },
});
