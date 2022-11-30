import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Checkbox, TextInput } from 'react-native-paper';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Block from '../../common-components/Block';
import Button from '../../common-components/Button';
import Text from '../../common-components/Text';
import Header from '../../common-components/header';
import { light } from '../../common-components/theme/colors';
import { DateUtils } from '../../utils/dateUtils';
import { ObjectFactory } from '../../utils/objectFactory';
import { URLConstants } from '../../constants/urlConstants';
import { CommonUtils } from '../../utils/commonUtils';
import { ComponentConstants } from '../../constants/componentConstants';
const AppConstant = require('../../../app.json');

const CompleteTrip = () => {
  const [state, setState] = useState({
    first: false,
    second: false,
    third: false,
    four: false,
    five: false,
    six: false,
    seven: false,
  });
  const [noShow, setNoShow] = useState(null);
  const [homeAssitance, sethomeAssitance] = useState(null);
  const [additionalPassenger, setAdditionalPassenger] = useState(null);
  const [wasBariatricServiceRequired, setWasBariatricServiceRequired] = useState(null);
  const [requestDriverToWait, setRequestDriverToWait] = useState(null);
  const [additionalText, setadditionalText] = useState('');
  const [additionalNumbers, setadditionalNumbers] = useState('');
  const [Minutes, setMinutes] = useState('00');
  const [Hours, setHours] = useState('');
  const [loader, setLoader] = useState(false);
  const { params } = useRoute();
  console.log('params: ', params);
  const { navigate } = useNavigation();

  const onSubmit = async () => {
    const navType =
      params.type === 'Delivery'
        ? ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME
        : ComponentConstants.TRANSPORTATION_SCREEN_NAME;
    setLoader(true);
    const waitingValue =
      DateUtils.convertMinutesToMillis(Hours * 60) +
      DateUtils.convertMinutesToMillis(Minutes);
    const iHttpService = ObjectFactory.getHttpService();
    const dataBody = {
      requestId: params.requestId,
      waitingTime: Hours ? waitingValue : 0, // Time in milliseconds
      noOfAdditionalPassenger: additionalPassenger
        ? Number(additionalNumbers)
        : additionalPassenger,
      wasHomeAssistanceRequired: homeAssitance,
      noShow: noShow,
      additionalNotes: additionalText,
      wasBariatricServiceRequired,
    };
    const apiRequest = {
      baseURL: AppConstant.serverUrl,
      data: dataBody,
      url: `${URLConstants.HTTP_URL_ROUTES}/${params.routeId}/complete`,
    };
    const response = await iHttpService.put(apiRequest);
    console.log('response: ', response);
    if (response.success) {
      navigate(navType);
      setLoader(false);
    } else {
      CommonUtils.showError(response);
      setLoader(false);
    }
  };

  return (
    <Block>
      <Header
        leftIcon={false}
        // onPress={() => navigate(navType)}
        centerText={
          params.type === 'Delivery' ? 'Complete Delievery' : 'Complete Trip'
        }
      />
      <KeyboardAwareScrollView>
        <Block flex={false} padding={[heightPercentageToDP(2), wp(5)]}>
          <Text size={16}>Was there a request for the driver to wait ?</Text>
          <Block flex={false} row>
            <Checkbox.Item
              style={styles.checkbox}
              status={
                requestDriverToWait === true
                  ? 'checked'
                  : requestDriverToWait === false
                    ? 'unchecked'
                    : null
              }
              label="Yes"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                setRequestDriverToWait(true);
              }}
            />
            <Checkbox.Item
              style={styles.checkbox}
              status={
                requestDriverToWait === false
                  ? 'checked'
                  : requestDriverToWait === true
                    ? 'unchecked'
                    : null
              }
              label="No"
              position="leading"
              mode="android"
              labelStyle={styles.label}
              color={light.secondary}
              onPress={() => {
                setRequestDriverToWait(false);
              }}
            />
          </Block>
          {requestDriverToWait && (
            <Block margin={[heightPercentageToDP(0.5), 0]} flex={false} row>
              <TextInput
                mode="outlined"
                style={{
                  marginRight: wp(3),
                  width: wp(25),
                }}
                placeholder="Hours"
                label="Hours"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={(s) => {
                  if (Number(s) > 12) {
                    setHours('');
                  } else {
                    setHours(s);
                  }
                }}
                value={Hours}
              />
              <TextInput
                mode="outlined"
                style={{
                  width: wp(25),
                }}
                placeholder="Minutes"
                label="Minutes"
                maxLength={2}
                keyboardType="number-pad"
                onChangeText={(s) => {
                  if (Number(s) > 60) {
                    setMinutes('');
                  } else if (!Hours) {
                    setHours('00');
                  } else {
                    setMinutes(s);
                  }
                }}
                value={Minutes}
              />
            </Block>
          )}
          <Text size={16}>
            Were there any additional passengers (not including the patient and caregiver companion)?
          </Text>

          <Block flex={false} row>
            <Checkbox.Item
              style={styles.checkbox}
              status={
                additionalPassenger === true
                  ? 'checked'
                  : additionalPassenger === false
                    ? 'unchecked'
                    : null
              }
              label="Yes"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                setAdditionalPassenger(true);
              }}
            />
            <Checkbox.Item
              style={styles.checkbox}
              status={
                additionalPassenger === false
                  ? 'checked'
                  : additionalPassenger === true
                    ? 'unchecked'
                    : null
              }
              label="No"
              position="leading"
              mode="android"
              labelStyle={styles.label}
              color={light.secondary}
              onPress={() => {
                setAdditionalPassenger(false);
              }}
            />
          </Block>
          {additionalPassenger && (
            <Block flex={false}>
              <TextInput
                mode="outlined"
                placeholder="Additional Passenger"
                label="Additional Passenger"
                keyboardType="number-pad"
                onChangeText={(s) => {
                  setadditionalNumbers(s);
                }}
                value={additionalNumbers}
              />
            </Block>
          )}
          <Text margin={[heightPercentageToDP(1), 0, 0]} size={16}>
            Was home assistance required?
          </Text>
          <Block flex={false} row>
            <Checkbox.Item
              style={styles.checkbox}
              status={
                homeAssitance === true
                  ? 'checked'
                  : homeAssitance === false
                    ? 'unchecked'
                    : null
              }
              label="Yes"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                sethomeAssitance(true);
              }}
            />
            <Checkbox.Item
              style={styles.checkbox}
              status={
                homeAssitance === false
                  ? 'checked'
                  : homeAssitance === true
                    ? 'unchecked'
                    : null
              }
              label="No"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                sethomeAssitance(false);
              }}
            />
          </Block>
          <Text size={16}>
            Did the patient refuse service, or fail to appear for the service?
          </Text>
          <Block flex={false} row>
            <Checkbox.Item
              style={styles.checkbox}
              status={
                noShow === true
                  ? 'checked'
                  : noShow === false
                    ? 'unchecked'
                    : null
              }
              label="Yes"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                setNoShow(true);
              }}
            />
            <Checkbox.Item
              style={styles.checkbox}
              status={
                noShow === false
                  ? 'checked'
                  : noShow === true
                    ? 'unchecked'
                    : null
              }
              label="No"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                setNoShow(false);
              }}
            />
          </Block>
          <Text size={16}>
            Were bariatric services required?
          </Text>

          <Block flex={false} row>
            <Checkbox.Item
              style={styles.checkbox}
              status={
                wasBariatricServiceRequired === true
                  ? 'checked'
                  : wasBariatricServiceRequired === false
                    ? 'unchecked'
                    : null
              }
              label="Yes"
              position="leading"
              labelStyle={styles.label}
              mode="android"
              color={light.secondary}
              onPress={() => {
                setWasBariatricServiceRequired(true);
              }}
            />
            <Checkbox.Item
              style={styles.checkbox}
              status={
                wasBariatricServiceRequired === false
                  ? 'checked'
                  : wasBariatricServiceRequired === true
                    ? 'unchecked'
                    : null
              }
              label="No"
              position="leading"
              mode="android"
              labelStyle={styles.label}
              color={light.secondary}
              onPress={() => {
                setWasBariatricServiceRequired(false);
              }}
            />
          </Block>
          <Block flex={false}>
            <Text
              size={16}
              margin={[heightPercentageToDP(1), 0, heightPercentageToDP(1), 0]}>
              Additional Notes
            </Text>
            <TextInput
              mode="outlined"
              placeholder="This is provider additional note"
              label="This is provider additional note"
              onChangeText={(s) => {
                setadditionalText(s);
              }}
              value={additionalText}
            />
          </Block>

          <Block padding={[heightPercentageToDP(2), wp(5)]} flex={false}>
            <Button
              isLoading={loader}
              disabled={
                requestDriverToWait === null ||
                (requestDriverToWait && !Hours) ||
                additionalPassenger === null ||
                (additionalPassenger && !additionalNumbers) ||
                homeAssitance === null ||
                noShow === null || wasBariatricServiceRequired === null
              }
              onPress={() => onSubmit()}
              color={'secondary'}>
              Submit
            </Button>
          </Block>
        </Block>
      </KeyboardAwareScrollView>
    </Block>
  );
};
const styles = StyleSheet.create({
  checkbox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: -wp(4),
  },
  label: {
    textAlign: 'left',
    marginLeft: wp(3),
  },
});
export default CompleteTrip;
