import React from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  LogBox,
  BackHandler,
} from 'react-native';
import {Text} from 'react-native-paper';
import {CommonUtils} from '../utils/commonUtils';
import {InterpretationRequestStyles} from '../assets/styles/InterpretationRequestStyles';
import {CommonStyles} from '../assets/styles/commonStyles';
import {RouteTabState} from '../types/types';
import {ColorConstants} from '../constants/colorConstants';
import {DateUtils} from '../utils/dateUtils';
import {MathUtils} from '../utils/mathUtils';
import {ComponentConstants} from '../constants/componentConstants';
import {SettingStyles} from '../assets/styles/settingStyles';
import {Route, ServiceRequest} from '../types/entity';
import {Context} from '../constants/contextConstants';
import {Platform} from 'react-native';

export class RouteTab extends React.Component<any, RouteTabState> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.serviceRequest as ServiceRequest,
      transportRoute: this.props.route as Route,
    };
    if (this.props.serviceRequest && this.props.route) {
      this.setState({
        serviceRequest: this.props.serviceRequest,
        transportRoute: this.props.route,
      });
    }
  }

  private backAction = () => {
    if (
      this.state.serviceRequest &&
      this.state.serviceRequest.deliveryRequest
    ) {
      this.props.navigation.navigate(
        ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME,
        {requestService: this.state.serviceRequest},
      );
      return true;
    }
    if (
      this.state.serviceRequest &&
      this.state.serviceRequest.transportRequest
    ) {
      this.props.navigation.navigate(
        ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME,
        {requestService: this.state.serviceRequest},
      );
      return true;
    }
  };
  componentDidMount() {
    LogBox.ignoreAllLogs();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  render() {
    return (
      <View style={[CommonStyles.container, {height: 'auto'}]}>
        <SafeAreaView>
          {this.state.transportRoute ? (
            <View style={{width: 350}}>
              <View style={{}}>
                <View style={InterpretationRequestStyles.labelContainer}>
                  <View style={InterpretationRequestStyles.submittedAt}>
                    <Text
                      style={{
                        color: ColorConstants.BLACK,
                        fontWeight: 'bold',
                        fontSize: 12,
                      }}>
                      {
                        this.state.transportRoute.pickupAddress.fullAddress.split(
                          ',',
                        )[0]
                      }{' '}
                      to{' '}
                      {
                        this.state.transportRoute.dropoffAddress.fullAddress.split(
                          ',',
                        )[0]
                      }
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{paddingRight: '5%'}}>
                <View style={InterpretationRequestStyles.labelContainer}>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text style={InterpretationRequestStyles.label}>
                      {CommonUtils.translateMessageCode('pickupAddress')}
                    </Text>
                    <Text>
                      {this.state.transportRoute.pickupAddress.fullAddress}
                    </Text>
                  </View>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text style={InterpretationRequestStyles.label}>
                      {CommonUtils.translateMessageCode('dropoffAddress')}
                    </Text>
                    <Text>
                      {this.state.transportRoute.dropoffAddress.fullAddress}
                    </Text>
                  </View>
                </View>
                <View style={InterpretationRequestStyles.labelContainer}>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text style={InterpretationRequestStyles.label}>
                      {CommonUtils.translateMessageCode('pickupTime')}
                    </Text>
                    <Text>
                      {DateUtils.formatDate(
                        this.state.transportRoute.pickupTime,
                        DateUtils.FORMAT_DATETIME_AM_PM_12,
                      )}
                    </Text>
                  </View>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text style={InterpretationRequestStyles.label}>
                      {CommonUtils.translateMessageCode('expectedArrivalTime')}
                    </Text>
                    <Text>
                      {DateUtils.formatDate(
                        this.state.transportRoute.expectedArrivalTime,
                        DateUtils.FORMAT_DATETIME_AM_PM_12,
                      )}
                    </Text>
                  </View>
                </View>
                <View style={InterpretationRequestStyles.labelContainer}>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text style={InterpretationRequestStyles.label}>
                      {CommonUtils.translateMessageCode('totalDistance')}
                    </Text>
                    <Text>{this.state.transportRoute.totalMiles} Miles</Text>
                  </View>
                  {this.state.serviceRequest?.transportRequest && (
                    <View style={InterpretationRequestStyles.labelBox}>
                      <Text style={InterpretationRequestStyles.label}>
                        {CommonUtils.translateMessageCode('vehicalType')}
                      </Text>
                      <Text>
                        {
                          this.state.serviceRequest?.transportRequest
                            ?.vehicleType
                        }
                      </Text>
                    </View>
                  )}
                  {this.state.serviceRequest.deliveryRequest &&
                  this.state.serviceRequest.deliveryRequest.deliveredOn ? (
                    <View style={InterpretationRequestStyles.labelBox}>
                      <Text style={InterpretationRequestStyles.label}>
                        Delivered At
                      </Text>
                      <Text>
                        {DateUtils.formatDate(
                          this.state.serviceRequest.deliveryRequest.deliveredOn,
                          DateUtils.FORMAT_DATETIME_AM_PM_12,
                        )}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {this.state.transportRoute.estimatedPayout &&
                this.state.transportRoute.status !== 'Completed' &&
                !this.context.sessionInfo.scopes.includes('driver') ? (
                  <View style={InterpretationRequestStyles.labelContainer}>
                    <View style={InterpretationRequestStyles.labelBox}>
                      <Text style={InterpretationRequestStyles.label}>
                        {CommonUtils.translateMessageCode('estimatedPayOut')}
                      </Text>
                      <Text>
                        {MathUtils.formatCurrency(
                          this.state.transportRoute.estimatedPayout,
                        )}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {this.state.transportRoute.driverName ? (
                  <View style={InterpretationRequestStyles.labelContainer}>
                    <View style={InterpretationRequestStyles.labelBox}>
                      <Text style={InterpretationRequestStyles.label}>
                        {this.state.transportRoute.status == 'Completed'
                          ? 'Completed By'
                          : 'Assigned Driver'}
                      </Text>
                      <Text>{this.state.transportRoute.driverName}</Text>
                    </View>
                    {this.state.transportRoute.driverName &&
                    this.context.sessionInfo.scopes.includes('transporter') &&
                    this.state.transportRoute.status == 'Accepted' ? (
                      <TouchableOpacity
                        style={{...SettingStyles.buttonCertificate}}
                        onPress={() =>
                          this.props.navigation.navigate(
                            ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME,
                            {
                              routeId: this.state.transportRoute.id,
                              serviceRequest: this.state.serviceRequest,
                            },
                          )
                        }>
                        <Text
                          style={{
                            color: ColorConstants.WHITE,
                            alignItems: 'center',
                            marginLeft: '15%',
                          }}>
                          Change Driver
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    {this.state.transportRoute.status === 'Completed' ? (
                      <View style={InterpretationRequestStyles.labelBox}>
                        <Text style={InterpretationRequestStyles.label}>
                          Completed On
                        </Text>
                        <Text>
                          {DateUtils.formatDate(
                            this.state.transportRoute.lastModifiedOn,
                            DateUtils.FORMAT_DATETIME_AM_PM_12,
                          )}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
                <View style={[InterpretationRequestStyles.actionButtons]}>
                  <View style={InterpretationRequestStyles.buttonBox}>
                    {!this.state.transportRoute.driverName &&
                    this.state.transportRoute.status == 'Accepted' ? (
                      <TouchableOpacity
                        style={SettingStyles.buttonCertificate}
                        onPress={() =>
                          this.props.navigation.navigate(
                            ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME,
                            {
                              routeId: this.state.transportRoute.id,
                              serviceRequest: this.state.serviceRequest,
                            },
                          )
                        }>
                        <Text
                          style={{
                            color: ColorConstants.WHITE,
                            alignItems: 'center',
                            marginLeft: '15%',
                          }}>
                          {CommonUtils.translateMessageCode('assignDriver')}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    {this.state.transportRoute.driverName &&
                    this.context.sessionInfo.scopes.includes('transporter') &&
                    this.state.transportRoute.status === 'Accepted' ? (
                      <TouchableOpacity
                        style={SettingStyles.buttonCertificate}
                        onPress={() =>
                          this.props.navigation.navigate(
                            ComponentConstants.COMPLETE_ROUTE_SCREEN_NAME,
                            {
                              routeId: this.state.transportRoute.id,
                              requestId: this.state.serviceRequest.id,
                              serviceRequest: this.state.serviceRequest,
                            },
                          )
                        }>
                        <Text
                          style={{
                            color: ColorConstants.WHITE,
                            alignItems: 'center',
                            marginLeft: '25%',
                          }}>
                          Complete
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    {this.state.transportRoute.driverName &&
                    this.context.sessionInfo.scopes.includes('driver') &&
                    this.state.serviceRequest.deliveryRequest &&
                    !this.state.serviceRequest.deliveryRequest.deliveredOn &&
                    this.state.transportRoute.status === 'Accepted' ? (
                      <TouchableOpacity
                        style={SettingStyles.buttonCertificate}
                        onPress={() =>
                          this.props.navigation.navigate(
                            ComponentConstants.COMPLETE_DELIVERY_REQUEST_SCREEN_NAME,
                            {
                              routeId: this.state.transportRoute.id,
                              requestId: this.state.serviceRequest.id,
                              serviceRequest: this.state.serviceRequest,
                            },
                          )
                        }>
                        <Text
                          style={{
                            color: ColorConstants.WHITE,
                            alignItems: 'center',
                            marginLeft: '5%',
                          }}>
                          Complete Delivery
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={InterpretationRequestStyles.buttonBox}>
                    <TouchableOpacity
                      style={SettingStyles.buttonCertificate}
                      onPress={() => {
                        if (Platform.OS === 'ios') {
                          this.props.navigation.navigate(
                            ComponentConstants.GOOGLE_MAP_SCREEN_NAME,
                            {
                              mapRoute: this.state.transportRoute.googleMap,
                            },
                          );
                        } else {
                          this.props.navigation.navigate(
                            ComponentConstants.GOOGLE_MAP_Android_SCREEN_NAME,
                            {mapRoute: this.state.transportRoute.googleMap},
                          );
                        }
                      }}>
                      <Text
                        style={{
                          color: ColorConstants.WHITE,
                          alignItems: 'center',
                          paddingHorizontal: '25%',
                        }}>
                        {CommonUtils.translateMessageCode('viewMap')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    );
  }
}
