import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {InterpretationRequestStyles} from '../../../assets/styles/InterpretationRequestStyles';
import Block from '../../../common-components/Block';
import Text from '../../../common-components/Text';
import Button from '../../../common-components/Button';
import Header from '../../../common-components/header';
import {ColorConstants} from '../../../constants/colorConstants';
import {ComponentConstants} from '../../../constants/componentConstants';
import {Context} from '../../../constants/contextConstants';
import {IconConstants} from '../../../constants/iconConstants';
import {CommonUtils} from '../../../utils/commonUtils';
import {DateUtils} from '../../../utils/dateUtils';
import Feather from 'react-native-vector-icons/Feather';
import {ObjectFactory} from '../../../utils/objectFactory';
import {Divider} from 'react-native-paper';
const CMRDetailsScreen = () => {
  const {params} = useRoute();
  const {navigate, goBack} = useNavigation();
  const context = useContext(Context.GlobalContext);
  const {requestService} = params;
  const styles = StyleSheet.create({
    labelBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // alignItems: 'center',
      marginTop: heightPercentageToDP(1.1),
    },
    subtitle: {
      color: ColorConstants.DARKGRAY,
      lineHeight: 20,
      width: widthPercentageToDP(43),
      textAlign: 'right',
    },
    label: {
      lineHeight: 20,
      width: widthPercentageToDP(43),
    },
  });

  const commonView = (label, value) => {
    return (
      <View style={styles.labelBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{value}</Text>
      </View>
    );
  };

  const rejectRequest = async () => {
    if (requestService) {
      const response = await ObjectFactory.getRequestService(
        context,
      ).rejectRequest(requestService.id);
      if (response.success) {
        goBack();
      }
    }
  };
  const acceptRequest = async () => {
    if (requestService) {
      const response = await ObjectFactory.getRequestService(
        context,
      ).acceptRequest(requestService.id);
      if (response.success) {
        goBack();
      }
    }
  };
  const renderItem = (item) => {
    const address = item.appointment.patient.address;
    return (
      <Block
        flex={false}
        margin={[heightPercentageToDP(1), widthPercentageToDP(3)]}
        shadow
        borderRadius={10}
        color="#fff"
        padding={[heightPercentageToDP(2), widthPercentageToDP(3)]}>
        {commonView('Patient Name', item.appointment.patient.fullName || 'N/A')}
        {commonView('Service', 'Comprehensive Medication Review')}
        {commonView(
          'Health Insaurance Name',
          item.cmrRequest.healthInsuranceName || 'N/A',
        )}
        {commonView(
          'Estimate Payouts',
          `USD${item.cmrRequest.estimatedPayout}` || 'N/A',
        )}
        {commonView(
          'CMR Date & Time',
          DateUtils.formatDate(
            item.appointment.timestamp,
            DateUtils.FORMAT_DATETIME_MONTH,
          ) || 'N/A',
        )}
        {commonView(
          'Submitted At',
          DateUtils.formatDate(
            item.createdOn,
            DateUtils.FORMAT_DATETIME_MONTH,
          ) || 'N/A',
        )}
        {commonView('Additional Notes', 'N/A')}
        <Divider style={{marginVertical: heightPercentageToDP(2)}} />
        <Text size={14}>Patient Address</Text>
        {commonView('Full Address', address.fullAddress || 'N/A')}
        {commonView('City', address.city || 'N/A')}
        {commonView('Country', address.country || 'N/A')}
        {commonView('State', address.state || 'N/A')}
        {commonView('Zip', address.zip || 'N/A')}
        {item.status === 'Pending' && (
          <View
            style={[
              InterpretationRequestStyles.actionButtons,
              {marginTop: heightPercentageToDP(2)},
            ]}>
            <View style={InterpretationRequestStyles.buttonBox}>
              <TouchableOpacity
                style={[
                  InterpretationRequestStyles.button,
                  InterpretationRequestStyles.buttonLeft,
                ]}
                onPress={() =>
                  CommonUtils.showConfirmation(
                    '',
                    acceptRequest,
                    undefined,
                    CommonUtils.translateMessageCode('acceptCMR'),
                    'No',
                    'Yes',
                  )
                }>
                <Feather
                  style={InterpretationRequestStyles.actionIcon}
                  name={IconConstants.CHECK}
                  color={ColorConstants.GREEN}
                  size={IconConstants.ICON_SIZE_20}
                />
                <Text style={InterpretationRequestStyles.buttonLabel}>
                  {CommonUtils.translateMessageCode('accept')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={InterpretationRequestStyles.buttonBox}>
              <TouchableOpacity
                style={[
                  InterpretationRequestStyles.button,
                  InterpretationRequestStyles.buttonRight,
                ]}
                onPress={() =>
                  CommonUtils.showConfirmation(
                    '',
                    rejectRequest,
                    undefined,
                    CommonUtils.translateMessageCode('rejectCMR'),
                    'No',
                    'Yes',
                  )
                }>
                <Feather
                  style={InterpretationRequestStyles.actionIcon}
                  name={IconConstants.CLOSE}
                  color={ColorConstants.RED}
                  size={IconConstants.ICON_SIZE_20}
                />
                <Text style={InterpretationRequestStyles.buttonLabel}>
                  {CommonUtils.translateMessageCode('reject')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {item.status === 'Confirmed' ? (
          <Button
            // style={{width: widthPercentageToDP(42)}}
            onPress={() =>
              navigate(ComponentConstants.CMR_COMPLETE_SCREEN_NAME, {
                requestId: item.id,
                serviceRequest: item,
              })
            }
            color="secondary">
            Complete CMR
          </Button>
        ) : null}
      </Block>
    );
  };
  return (
    <Block primary>
      <Header centerText="CMR Details" />
      {renderItem(requestService)}
    </Block>
  );
};

export default CMRDetailsScreen;
