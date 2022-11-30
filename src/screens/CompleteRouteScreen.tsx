import React from 'react';
import {View, Alert, BackHandler, ScrollView} from 'react-native';
import {Text, TextInput, RadioButton} from 'react-native-paper';
import {ObjectFactory} from '../utils/objectFactory';
import {DateUtils} from '../utils/dateUtils';
import {CommonUtils} from '../utils/commonUtils';
import {CommonStyles} from '../assets/styles/commonStyles';
import {Context} from '../constants/contextConstants';
import {CompleteRouteState} from '../types/types';
import {ComponentConstants} from '../constants/componentConstants';
import {ServiceRequest} from '../types/entity';
import {CompleteRouteRequest} from '../types/requests';
import {InterpretationRequestStyles} from '../assets/styles/InterpretationRequestStyles';
import {ColorConstants} from '../constants/colorConstants';
import {ApiRequest} from '../services/util/iHttpService';
import {URLConstants} from '../constants/urlConstants';
const AppConstant = require('../../app.json');
import Header from '../common-components/header';
import Button from '../common-components/Button';
import {widthPercentageToDP} from 'react-native-responsive-screen';
export default class CompleteRouteScreen extends React.Component<
  any,
  CompleteRouteState
> {
  static contextType = Context.GlobalContext;
  private serviceRequest: ServiceRequest;
  constructor(props: Readonly<any>) {
    super(props);
    this.serviceRequest = this.props.route.params.serviceRequest;
    this.state = {
      serviceRequest: this.props.route.params.serviceRequest,
      routeId: this.props.route.params.routeId,
      isWaiting: 'false',
      disableSubmit: false,
      waitingHours: 0,
      waitingMinutes: 0,
    };
  }

  private getServiceRequestDetails = async (requestId: string) => {
    const response = await ObjectFactory.getRequestService(
      this.context,
    ).getRequestDetails(requestId);
    if (response.success && response.data) {
      this.setState({serviceRequest: response.data});
    }
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    if (this.serviceRequest.deliveryRequest) {
      this.props.navigation.navigate(
        ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME,
        {requestService: this.serviceRequest},
      );
      return true;
    }
    if (this.serviceRequest.transportRequest) {
      this.props.navigation.navigate(
        ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME,
        {requestService: this.serviceRequest},
      );
      return true;
    }
  };

  private validateWaitingTime(value: string) {
    if (this.state.isWaiting === 'false') {
      this.setState({disableSubmit: true});
    } else {
      this.setState({waitingHours: 0, waitingMinutes: 0});
      this.setState({disableSubmit: false});
    }
    if (this.state.waitingHours > 0 || this.state.waitingMinutes > 0) {
      this.setState({disableSubmit: false});
    }
  }

  private completeRequest = async () => {
    if (this.state.serviceRequest && this.state.serviceRequest.id) {
      const completeRouteRequest: CompleteRouteRequest = {
        requestId: this.state.serviceRequest.id,
        waitingTime: 0,
      };
      if (this.state.waitingHours > 0 || this.state.waitingMinutes > 0) {
        completeRouteRequest.waitingTime =
          DateUtils.convertMinutesToMillis(this.state.waitingMinutes) +
          DateUtils.convertMinutesToMillis(this.state.waitingHours * 60);
      }
      const request: ApiRequest = {
        baseURL: AppConstant.serverUrl,
        data: completeRouteRequest,
        url: `${URLConstants.HTTP_URL_ROUTES}/${this.state.routeId}/complete`,
        loaderEvent: {
          show: true,
        },
      };
      const response = await ObjectFactory.getHttpService().put<string>(
        request,
      );
      if (response.success) {
        Alert.alert(
          'Success',
          'Route has been marked as completed successfully!',
        );
        await this.getServiceRequestDetails(this.state.serviceRequest.id);
        if (this.state.serviceRequest.status !== 'Completed') {
          this.props.navigation.navigate(
            ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME,
            {requestService: this.state.serviceRequest},
          );
        } else if (
          this.state.serviceRequest.status === 'Completed' &&
          this.state.serviceRequest.transportRequest
        ) {
          this.props.navigation.navigate(
            ComponentConstants.TRANSPORTATION_SCREEN_NAME,
            {status: 'Completed'},
          );
        } else if (
          this.state.serviceRequest.status === 'Completed' &&
          this.state.serviceRequest.deliveryRequest
        ) {
          this.props.navigation.navigate(
            ComponentConstants.DELIVERY_SCREEN_NAME,
            {status: 'Completed'},
          );
        }
      }
    }
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Complete Route" />
        <ScrollView>
          <View>
            <View style={InterpretationRequestStyles.labelComplete}>
              <Text
                style={[
                  InterpretationRequestStyles.labelCompleteLine,
                  {fontSize: 16},
                ]}>
                Was there a request for the driver to wait?
              </Text>
            </View>
            <View style={InterpretationRequestStyles.radioGroup}>
              <RadioButton.Group
                onValueChange={(newValue) => {
                  this.setState({isWaiting: newValue});
                  this.validateWaitingTime(newValue);
                }}
                value={this.state.isWaiting}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <RadioButton value="true" color={ColorConstants.GREEN} />
                    <RadioButton value="false" color={ColorConstants.GREEN} />
                  </View>
                  <View>
                    <Text
                      onPress={() => {
                        this.setState({isWaiting: 'true'});
                        this.validateWaitingTime('true');
                      }}
                      style={{marginTop: '35%'}}>
                      Yes
                    </Text>
                    <Text
                      onPress={() => {
                        this.setState({isWaiting: 'false'});
                        this.validateWaitingTime('false');
                      }}
                      style={{marginTop: '70%'}}>
                      No
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          {this.state.isWaiting === 'true' ? (
            <View style={InterpretationRequestStyles.radioGroup}>
              <View>
                <Text
                  style={[
                    InterpretationRequestStyles.labelCompleteLine,
                    {fontSize: 16},
                  ]}>
                  What was the waiting time?
                </Text>
                <TextInput
                  maxLength={2}
                  style={CommonStyles.waitinTimeInput}
                  textAlignVertical="center"
                  placeholder="0"
                  autoCapitalize="none"
                  mode="outlined"
                  onChangeText={(value: string) => {
                    this.setState({waitingHours: value as any});
                    this.setState({disableSubmit: false});
                  }}
                />
                <Text style={{marginTop: 3, marginLeft: '5%'}}>Hours</Text>
                <Text
                  style={{marginTop: '-19%', marginLeft: '25%', fontSize: 30}}>
                  :
                </Text>
              </View>
              <View
                style={[
                  InterpretationRequestStyles.minutesInput,
                  {marginTop: -60},
                ]}>
                <TextInput
                  maxLength={2}
                  style={CommonStyles.waitinTimeInput}
                  textAlignVertical="center"
                  placeholder="0"
                  autoCapitalize="none"
                  mode="outlined"
                  onChangeText={(value: string) => {
                    this.setState({waitingMinutes: value as any});
                    this.setState({disableSubmit: false});
                  }}
                />
                <Text style={{marginTop: 3, marginLeft: '5%'}}>Minutes</Text>
              </View>
            </View>
          ) : null}
          <Button
            style={{width: widthPercentageToDP(30), alignSelf: 'center'}}
            disabled={this.state.disableSubmit}
            color="secondary"
            onPress={() => this.completeRequest()}>
            {CommonUtils.translateMessageCode('submit')}
          </Button>
        </ScrollView>
      </View>
    );
  }
}
