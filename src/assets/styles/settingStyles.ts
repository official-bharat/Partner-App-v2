import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ColorConstants } from '../../constants/colorConstants';

export const SettingStyles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        margin: 10
    },
    iconCircle: {
        borderRadius: 100,
        borderWidth: 45,
        borderColor: ColorConstants.LIGHT_GREEN,
        zIndex: 1,
        alignContent: 'center'
    },
    icon: {
        bottom: hp('-3%'),
        right: wp('-4%'),
        // zIndex: 2,
        position: 'absolute'
    },
    detailsContainer: {
        margin: wp('5%'),
        padding: wp('5%'),
        marginVertical: hp('1%')
    },
    labelContainer: {
        // flexDirection: 'row',
    },
    labelBox: {
        // width: '50%',
        fontSize: 14,
        margin: wp('3%'),
    },
    label: {
        color: ColorConstants.DARKGRAY,
        lineHeight: hp('2%')
    },
    buttonBox: {
        width: '50%',
        margin: 6,
    },
    buttonLabel: {
        marginTop: 5,
        textDecorationLine: 'underline',
        color: ColorConstants.BLUE
    },
    buttonPassword: {
        borderColor: ColorConstants.GREEN,
        borderRadius: 6,
        flexDirection: 'row'
    },
    labelCertificate: {
        color: ColorConstants.WHITE,
        paddingHorizontal: hp('2%')
    },
    buttonCertificate: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: ColorConstants.GREEN,
        width: wp('35%'),
        height: hp('5%')
    },

    buttonAccept: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        width: wp('35%'),
        height: hp('5%')
    },

    buttonSubmit: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        width: wp('30%'),
        height: hp('5%')
    },
});