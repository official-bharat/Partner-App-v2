import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

const CompleteRequestStyles = StyleSheet.create({
  action: {
    marginTop: Platform.OS === 'ios' ? hp('10%') : hp('10%'),
  },
  actionEndTime: {
    marginTop: Platform.OS === 'ios' ? hp('2%') : hp('2%'),
  },
  buttonGroup: {
    zIndex: 2,
    flexDirection: 'row',
    borderRadius: wp('50%'),
    backgroundColor: ColorConstants.WHITE,
    marginLeft: wp('45%'),
    // width: wp('45%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('70%'),
    height: wp('10%'),
    bottom: hp('8%'),
    position: 'absolute',
  },
  showClockButton: {
    zIndex: 3,
    width: wp('90%'),
    backgroundColor: 'transparent',
    borderColor: ColorConstants.GRAY,
    color: ColorConstants.GRAY,
    marginHorizontal: wp('8%'),
    height: hp('8%'),
    position: 'absolute',
  },
});

export {CompleteRequestStyles};
