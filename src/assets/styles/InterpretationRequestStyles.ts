import {Platform, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../../constants/colorConstants';

export const InterpretationRequestStyles = StyleSheet.create({
  iconConatiner: {
    alignItems: 'center',
    margin: 10,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: wp('50%'),
    borderWidth: wp('10%'),
    borderColor: ColorConstants.LIGHT_GREEN,
    zIndex: 1,
    height: 50,
    width: 50,
    margin: wp('5%'),
  },
  icon: {
    top: hp('-2.5%'),
    zIndex: 2,
    position: 'absolute',
  },
  detailsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
  },
  labelContainer: {
    // flexDirection: 'row',
  },
  labelBox: {
    // width: '50%',
    fontSize: 14,
    // margin: wp('3%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
    alignItems: 'center',
  },
  label: {
    color: ColorConstants.DARKGRAY,
    lineHeight: 25,
  },
  bottomBox: {
    margin: 10,
    marginTop: 10,
  },
  actionButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: wp(5),
  },
  buttonBox: {
    width: '50%',
    margin: 6,
  },
  button: {
    height: hp('4%'),
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 6,
    width: '70%',
    padding: 6,
    paddingLeft: 18,
    alignItems: 'center',
  },
  buttonLeft: {
    borderColor: ColorConstants.GREEN,
    marginLeft: 25,
  },
  buttonRight: {
    borderColor: ColorConstants.RED,
  },
  buttonLabel: {
    color: ColorConstants.DARKGRAY,
    marginTop: 2,
  },
  buttonLabelCenter: {
    color: ColorConstants.DARKGRAY,
    marginTop: 2,
    marginLeft: wp('15%'),
  },
  actionIcon: {
    marginLeft: 6,
    paddingRight: 10,
  },
  submittedAt: {
    marginLeft: 15,
    marginTop: 15,
  },
  submitButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: wp(35),
  },

  labelComplete: {
    width: '100%',
    fontSize: 14,
    margin: wp('3%'),
    marginLeft: wp(5),
    marginTop: hp('2%'),
  },

  labelCompleteCmr: {
    width: '100%',
    fontSize: 14,
    textAlign: 'center',
  },
  radioGroup: {
    width: '100%',
    fontSize: 14,
    margin: wp('3%'),
    marginLeft: wp(5),
    marginTop: hp('-1%'),
  },
  labelCompleteLine: {
    color: ColorConstants.BLACK,
    lineHeight: 35,
  },
  waitingTime: {
    width: '100%',
    fontSize: 14,
    margin: wp('3%'),
    marginLeft: wp('10%'),
    marginTop: hp('-1%'),
  },
  minutesInput: {
    width: '100%',
    fontSize: 14,
    marginLeft: wp('32%'),
    marginTop: hp('-7%'),
  },
  completeRoute: {
    width: '50%',
    margin: 50,
  },
});
