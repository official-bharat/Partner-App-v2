import React from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Image,
  BackHandler,
  StyleSheet,
} from 'react-native';
import {Checkbox, Text, TextInput} from 'react-native-paper';
import {ObjectFactory} from '../utils/objectFactory';
import {DateUtils} from '../utils/dateUtils';
import {CommonUtils} from '../utils/commonUtils';
import {CompleteRequestStyles} from '../assets/styles/completeRequestStyles';
import {CompleteRequest} from '../types/requests';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {
  CommonStyles,
  footerImage,
  TextInputTheme,
} from '../assets/styles/commonStyles';
import {Context} from '../constants/contextConstants';
import {CompleteRequestState} from '../types/types';
import {ComponentConstants} from '../constants/componentConstants';
import {ServiceRequest} from '../types/entity';
import Header from '../common-components/header';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Block from '../common-components/Block';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {light} from '../common-components/theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../common-components/Button';

export default class CompleteRequestScreen extends React.Component<
  any,
  CompleteRequestState
> {
  static contextType = Context.GlobalContext;
  private serviceRequest: ServiceRequest;
  constructor(props: Readonly<any>) {
    super(props);
    this.serviceRequest = this.props.route.params.serviceRequest;
    this.state = {
      startTime: new Date(this.serviceRequest.appointment.timestamp),
      appointmentDuration: '',
      showStartTimepicker: false,
      showEndTimepicker: false,
      selectedStartTime: '',
      selectedEndTime: '',
      additionalNotes: '',
      noShow: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(
      ComponentConstants.INTERPRETATION_REQUEST_SCREEN_NAME,
      {serviceRequest: this.serviceRequest},
    );
    return true;
  };

  private onChangeTime = (time: any) => {
    if (time) {
      if (this.state.showStartTimepicker) {
        this.setState({
          startTime: time,
          selectedStartTime: DateUtils.formatTime(time, 'hh:mm a'),
          showEndTimepicker: false,
          showStartTimepicker: false,
        });
      } else {
        this.setState({
          selectedEndTime: DateUtils.formatTime(time, 'hh:mm a'),
          showEndTimepicker: false,
          showStartTimepicker: false,
        });
      }
    }
  };

  private completeRequest = async () => {
    if (this.state.selectedStartTime && this.state.appointmentDuration) {
      const completeRequest: CompleteRequest = {
        startTime: DateUtils.formatTime(this.state.startTime, 'HH:mm:ss'),
        noShow: this.state.noShow,
        additionalNotes: this.state.additionalNotes,
        appointmentDuration: Number(this.state.appointmentDuration),
      };
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).completeRequest(this.serviceRequest.id, completeRequest);
      if (response.success) {
        Alert.alert(
          'Success',
          'Request has been marked as completed successfully!',
        );
        this.props.navigation.navigate(
          ComponentConstants.INTERPRETATION_SCREEN_NAME,
        );
      } else {
        Alert.alert('Error', 'failed to complete');
      }
      console.log(response, 'response');
    }
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Complete Request" />
        <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
          {/* <Image
            style={CommonStyles.footerImage}
            source={footerImage}
            resizeMode="stretch"
          /> */}
          <View style={CompleteRequestStyles.action}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  showStartTimepicker: true,
                  showEndTimepicker: false,
                })
              }
              style={CompleteRequestStyles.showClockButton}
            />
            <TextInput
              label="Start Time"
              mode="outlined"
              editable={false}
              value={this.state.selectedStartTime}
              theme={TextInputTheme}
              style={CommonStyles.textInput}
              autoCapitalize="none"
            />

            <DateTimePicker
              isVisible={this.state.showStartTimepicker}
              is24Hour={false}
              testID="dateTimePicker2"
              value={this.state.startTime}
              mode="time"
              display="spinner"
              onConfirm={this.onChangeTime}
              onCancel={() =>
                this.setState({
                  showStartTimepicker: false,
                })
              }
            />
          </View>

          <View style={CompleteRequestStyles.actionEndTime}>
            <TextInput
              label="Meeting Duration (In Minutes)"
              placeholder="Meeting Duration"
              mode="outlined"
              // disabled={true}
              value={this.state.appointmentDuration}
              theme={TextInputTheme}
              style={CommonStyles.textInput}
              autoCapitalize="none"
              keyboardType="number-pad"
              maxLength={2}
              onChangeText={(s) => {
                this.setState({
                  appointmentDuration: s,
                });
              }}
            />
          </View>

          <Block flex={false} padding={[heightPercentageToDP(2), wp(8)]}>
            <Text size={16}>
              Did the patient refuse service, or fail to appear for the service
              ?
            </Text>
            <Block flex={false} row>
              <Checkbox.Item
                style={styles.checkbox}
                status={this.state.noShow === true ? 'checked' : 'unchecked'}
                label="Yes"
                position="leading"
                labelStyle={styles.label}
                mode="android"
                color={light.secondary}
                onPress={() => {
                  this.setState({
                    noShow: true,
                  });
                }}
              />
              <Checkbox.Item
                style={styles.checkbox}
                status={this.state.noShow !== true ? 'checked' : 'unchecked'}
                label="No"
                position="leading"
                mode="android"
                labelStyle={styles.label}
                color={light.secondary}
                onPress={() => {
                  this.setState({
                    noShow: false,
                  });
                }}
              />
            </Block>
            <Block flex={false}>
              <Text
                size={16}
                margin={[
                  heightPercentageToDP(1),
                  0,
                  heightPercentageToDP(1),
                  0,
                ]}>
                Additional Notes
              </Text>
              <TextInput
                mode="outlined"
                placeholder="This is provider additional note"
                label="This is provider additional note"
                style={[CommonStyles.textInput, {marginHorizontal: 0}]}
                onChangeText={(s) => {
                  this.setState({
                    additionalNotes: s,
                  });
                }}
                value={this.state.additionalNotes}
              />
            </Block>
          </Block>

          <Block
            flex={false}
            margin={[heightPercentageToDP(3), 0, 0]}
            padding={[0, wp(7)]}>
            <Button
              onPress={() => {
                this.completeRequest();
              }}
              style={{width: wp(40), alignSelf: 'flex-end', borderRadius: 40}}
              color="secondary">
              {CommonUtils.translateMessageCode('completeRequest')}
            </Button>
          </Block>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
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
