import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  LogBox,
  Alert,
} from 'react-native';
import {CommonStyles, TextInputTheme} from '../assets/styles/commonStyles';
import {CompleteDeliveryRequestState} from '../types/types';
import {CommonUtils} from '../utils/commonUtils';
import {ObjectFactory} from '../utils/objectFactory';
import {ComponentConstants} from '../constants/componentConstants';
import {Context} from '../constants/contextConstants';
import {InterpretationRequestStyles} from '../assets/styles/InterpretationRequestStyles';
import {SettingStyles} from '../assets/styles/settingStyles';
import {ColorConstants} from '../constants/colorConstants';
import {HelperText, RadioButton, TextInput} from 'react-native-paper';
import {LoginStyles} from '../assets/styles/loginStyles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Header from '../common-components/header';
import Button from '../common-components/Button';
import {ApiRequest, ApiResponse} from '../services/util/iHttpService';
import {URLConstants} from '../constants/urlConstants';
import {getAsync} from '../utils/local-storage';
import {Platform} from 'react-native';
const AppConstant = require('../../app.json');

export default class CompleteDeliveryRequestScreen extends React.Component<
  any,
  CompleteDeliveryRequestState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.route.params.serviceRequest,
      requestId: this.props.route.params.requestId,
      identificationCode: '',
      identificationCodeValid: false,
      disableSubmit: true,
      isWaiting: true,
      googleMap: this.props.route.params.mapRoute,
      routeId: this.props.route.params.routeId,
      type: this.props.route.params.type,
    };
  }

  private validVerificationCode = (value: string, key: string) => {
    if (key === 'identificationCode') {
      if (value.trim().length === 6) {
        this.setState({
          identificationCodeValid: false,
          identificationCode: value,
          disableSubmit: false,
        });
      } else {
        this.setState({identificationCodeValid: true, disableSubmit: true});
      }
    }
  };
  private completeRequest = async () => {
    if (this.state.identificationCode && this.state.requestId) {
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).verifyAndCompleteRequest(
        this.state.requestId,
        this.state.identificationCode,
      );
      if (response.success) {
        Alert.alert(
          'Success',
          'Order has been marked as delivered successfully!',
        );
        this.props.navigation.navigate(
          ComponentConstants.DELIVERY_SCREEN_NAME,
          {status: 'Completed'},
        );
      } else if (response.errorCode) {
        Alert.alert('Invalid Identification Code');
      }
    }
  };

  public async startTrip(
    requestId: string,
    routeId: string,
  ): Promise<ApiResponse<any>> {
    const dataBody = await getAsync('location');
    const iHttpService = ObjectFactory.getHttpService();
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      data: dataBody,
      url: `${URLConstants.HTTP_URL_ROUTES}/${requestId}/${routeId}/start`,
      loaderEvent: {
        show: true,
      },
    };
    // this.setState({
    //   loader:
    // })
    const response = await iHttpService.put<string>(apiRequest);
    if (response.success) {
      if (Platform.OS === 'ios') {
        this.props.navigation.navigate(
          ComponentConstants.GOOGLE_MAP_SCREEN_NAME,
          {
            mapRoute: this.state.googleMap,
            requestId: requestId,
            routeId: routeId,
            serviceRequest: this.state.serviceRequest,
            type: this.state.type,
            deliveryRoutes: this.props.route.params.deliveryRoutes || [],
          },
        );
      } else {
        this.props.navigation.navigate(
          ComponentConstants.GOOGLE_MAP_Android_SCREEN_NAME,
          {
            mapRoute: this.state.googleMap,
            requestId: requestId,
            routeId: routeId,
            serviceRequest: this.state.serviceRequest,
            type: this.state.type,
            deliveryRoutes: this.props.route.params.deliveryRoutes || [],
          },
        );
      }
    } else {
      CommonUtils.showError(response);
    }
    return response;
  }

  componentDidMount() {
    LogBox.ignoreAllLogs();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(
      ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME,
      {requestService: this.state.serviceRequest},
    );
    return true;
  };

  render() {
    const {requestId, routeId, type} = this.state;
    return (
      <View style={CommonStyles.container}>
        <Header
          centerText={
            type === 'Delivery'
              ? 'Complete Delivery Request'
              : 'Complete Transportation Request'
          }
        />
        <View
          style={{
            alignContent: 'center',
            padding: 5,
          }}
        />
        <View
          style={{
            alignContent: 'center',
          }}>
          <View>
            <View style={InterpretationRequestStyles.labelComplete}>
              <Text
                style={[
                  InterpretationRequestStyles.labelCompleteLine,
                  {fontSize: 16},
                ]}>
                Did you inform patient about the pickup?
              </Text>
            </View>
            <View style={InterpretationRequestStyles.radioGroup}>
              <RadioButton.Group
                onValueChange={(newValue) => {
                  this.setState({isWaiting: newValue});
                }}
                value={this.state.isWaiting}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <RadioButton value={true} color={ColorConstants.GREEN} />
                    <RadioButton value={false} color={ColorConstants.GREEN} />
                  </View>
                  <View>
                    <Text
                      onPress={() => {
                        this.setState({isWaiting: true});
                      }}
                      style={{marginTop: '35%'}}>
                      Yes
                    </Text>
                    <Text
                      onPress={() => {
                        this.setState({isWaiting: false});
                      }}
                      style={{marginTop: '70%'}}>
                      No
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View
            style={{
              alignContent: 'center',
              // marginVertical: heightPercentageToDP(2),
              padding: 5,
            }}>
            {!this.state.isWaiting && (
              <HelperText type="info" visible={true}>
                Note: Please call this number{' '}
                <Text style={{fontWeight: 'bold', color: ColorConstants.GREEN}}>
                  +1
                  {this.state.serviceRequest?.deliveryRequest
                    ?.confirmationMode === 'Business'
                    ? this.state.serviceRequest.appointment.facility.phone
                    : this.state.serviceRequest.appointment.patient.phone}
                </Text>
                {' Immediately'}
              </HelperText>
            )}
          </View>

          {/* <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10%',
            }}>
            <View style={InterpretationRequestStyles.buttonBox}>
              <TouchableOpacity
                style={[SettingStyles.buttonSubmit]}
                onPress={() => this.completeRequest()}>
                <Text
                  style={{
                    color: ColorConstants.WHITE,
                    alignItems: 'center',
                    paddingHorizontal: '28%',
                  }}>
                  {CommonUtils.translateMessageCode('submit')}
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}
          <Button
            onPress={() => {
              this.startTrip(requestId, routeId);
            }}
            disabled={!this.state.isWaiting}
            style={{width: widthPercentageToDP(30), alignSelf: 'center'}}
            color={'secondary'}>
            {CommonUtils.translateMessageCode('submit')}
          </Button>
        </View>
      </View>
    );
  }
}
