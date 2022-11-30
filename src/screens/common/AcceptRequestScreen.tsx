import {Context} from '../../constants/contextConstants';
import React, {Component} from 'react';
import {AcceptRequestState} from '../../types/types';
import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {InterpretationRequestStyles} from '../../assets/styles/InterpretationRequestStyles';
import {ObjectFactory} from '../../utils/objectFactory';
import {ColorConstants} from '../../constants/colorConstants';
import {CommonStyles} from '../../assets/styles/commonStyles';
import Feather from 'react-native-vector-icons/Feather';
import {CommonUtils} from '../../utils/commonUtils';
import {ScrollView} from 'react-native-gesture-handler';
import {DateUtils} from '../../utils/dateUtils';
import {IconConstants} from '../../constants/iconConstants';
import {SettingStyles} from '../../assets/styles/settingStyles';
import {ComponentConstants} from '../../constants/componentConstants';
import {MathUtils} from '../../utils/mathUtils';
import Header from '../../common-components/header';
import Block from '../../common-components/Block';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Button from '../../common-components/Button';
import {Platform} from 'react-native';
const ambulance = require('../../assets/images/ambulance-icon.png');
const home = require('../../assets/images/home-icon.png');
/**
 * @author <Azhar.K>
 * @description Accept Request Screen
 * @copyright Supra software solutions, inc
 */

export default class AcceptRequestScreen extends React.Component<
  any,
  AcceptRequestState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.route.params.serviceRequest,
      mapView: undefined,
      mapRoute: [],
      viewMap: false,
      routeIds: [],
      disableSubmit: true,
    };
    if (this.props.route.params.serviceRequest.id) {
      this.getServiceRequestDetails(this.props.route.params.serviceRequest.id);
    }
  }
  private routeIds: string[] = [];
  private getServiceRequestDetails = async (requestId: string) => {
    const response = await ObjectFactory.getRequestService(
      this.context,
    ).getRequestDetails(requestId);
    if (response.success && response.data) {
      this.setState({serviceRequest: response.data});
      if (response.data.transportRequest) {
        this.setState({mapRoute: response.data.transportRequest.mapRoutes});
      }
      if (response.data.deliveryRequest) {
        this.setState({mapRoute: response.data.deliveryRequest.mapRoutes});
      }
    }
  };

  private acceptRequest = async () => {
    if (this.state.serviceRequest && this.state.routeIds.length > 0) {
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).acceptRequest(this.state.serviceRequest.id as any, {
        routes: this.state.routeIds,
      });
      if (response.success) {
        await this.getServiceRequestDetails(
          this.state.serviceRequest.id as any,
        );
        const response = Alert.alert(
          'Awesome!',
          'Route has been assigned to you',
        );
        if (
          this.state.mapRoute &&
          this.state.mapRoute.length > 0 &&
          this.state.mapRoute.some((route) => route.status === 'Pending')
        ) {
          this.props.navigation.navigate(
            ComponentConstants.ACCEPT_REQUEST_SCREEN_NAME,
          );
        } else if (
          this.state.serviceRequest.status === 'Confirmed' &&
          this.state.serviceRequest.transportRequest
        ) {
          this.props.navigation.navigate(
            ComponentConstants.TRANSPORTATION_SCREEN_NAME,
            {status: 'Confirmed'},
          );
        } else if (
          this.state.serviceRequest.status === 'Confirmed' &&
          this.state.serviceRequest.deliveryRequest
        ) {
          this.props.navigation.navigate(
            ComponentConstants.DELIVERY_SCREEN_NAME,
            {status: 'Confirmed'},
          );
        }
        this.setState({disableSubmit: true});
      }
    }
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
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
  private setRouteId(routeId?: any) {
    const index = this.routeIds.indexOf(routeId);
    if (!index || index !== -1) {
      this.routeIds.splice(index, 1);
    } else if (this.routeIds.length >= 0) {
      this.routeIds.push(routeId);
    }
    this.setState({routeIds: this.routeIds});
    if (this.routeIds.length > 0) {
      this.setState({disableSubmit: false});
    } else {
      this.setState({disableSubmit: true});
    }
  }
  commonView = (label: any, value: any) => {
    return (
      <View style={styles.labelBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{value}</Text>
      </View>
    );
  };
  SubmitAlert = () => {
    const fullName = this.state.serviceRequest?.appointment?.patient?.fullName;
    const phone = this.state.serviceRequest?.appointment?.patient?.phone;
    const text = `Please click the box below to confirm that you have already called the patient.This is required before you can be officially assigned the request. If you have not, please call ${fullName} at ${phone} before the clicking the box. The ride will be assigned to another service provider if this is not done in one hour`;
    Alert.alert('Info', text, [
      {
        text: 'No',
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          this.acceptRequest();
        },
      },
    ]);
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Accepted Request" />
        <ScrollView style={{flex: 1}}>
          {this.state.serviceRequest &&
            (this.state.serviceRequest.transportRequest ||
              this.state.serviceRequest.deliveryRequest) &&
            this.state.mapRoute &&
            this.state.mapRoute.map((route, index) => (
              <View key={index}>
                <Block
                  flex={false}
                  margin={[heightPercentageToDP(1), widthPercentageToDP(3)]}
                  shadow
                  borderRadius={10}
                  color="#fff"
                  padding={[heightPercentageToDP(2), widthPercentageToDP(3)]}>
                  <Text style={{color: ColorConstants.BLACK}}>
                    {route.pickupAddress.fullAddress.split(',')[0]} to{' '}
                    {route.dropoffAddress.fullAddress.split(',')[0]}
                  </Text>
                  <View>
                    {this.commonView(
                      CommonUtils.translateMessageCode('pickupAddress'),
                      route.pickupAddress.fullAddress,
                    )}
                    {this.commonView(
                      CommonUtils.translateMessageCode('dropoffAddress'),
                      route.dropoffAddress.fullAddress,
                    )}
                    {this.commonView(
                      CommonUtils.translateMessageCode('pickupTime'),
                      DateUtils.formatDate(
                        route.pickupTime,
                        DateUtils.FORMAT_DATETIME_AM_PM_12,
                      ),
                    )}
                    {this.commonView(
                      CommonUtils.translateMessageCode('expectedArrivalTime'),
                      DateUtils.formatDate(
                        route.expectedArrivalTime,
                        DateUtils.FORMAT_DATETIME_AM_PM_12,
                      ),
                    )}
                    {this.commonView(
                      CommonUtils.translateMessageCode('totalDistance'),
                      `${route.totalMiles} Miles`,
                    )}
                    <View style={styles.labelBox}>
                      {this.state.serviceRequest &&
                      this.state.serviceRequest.deliveryRequest ? (
                        <View style={InterpretationRequestStyles.labelBox}>
                          <Text style={InterpretationRequestStyles.label}>
                            Delivery Item(s)
                          </Text>
                          {this.state.serviceRequest &&
                            this.state.serviceRequest.deliveryRequest &&
                            this.state.serviceRequest.deliveryRequest.deliveryItems.map(
                              (item, index) => <Text key={index}>{item}</Text>,
                            )}
                        </View>
                      ) : null}
                    </View>
                    {route.estimatedPayout && route.status !== 'Completed'
                      ? this.commonView(
                          CommonUtils.translateMessageCode('estimatedPayOut'),
                          MathUtils.formatCurrency(route.estimatedPayout),
                        )
                      : null}
                    <View style={[styles.actionButtons]}>
                      {this.state.serviceRequest &&
                      this.state.serviceRequest.status === 'Pending' ? (
                        <View>
                          {route.id ? (
                            <TouchableOpacity
                              style={[
                                styles.buttonAccept,
                                {
                                  backgroundColor: this.state.routeIds.includes(
                                    route.id,
                                  )
                                    ? ColorConstants.GREEN
                                    : ColorConstants.GRAY,
                                },
                              ]}
                              onPress={() => this.setRouteId(route.id)}>
                              <Feather
                                name={IconConstants.CHECK}
                                color={ColorConstants.WHITE}
                                size={IconConstants.ICON_SIZE_20}
                              />
                              <Text
                                style={{
                                  color: ColorConstants.WHITE,
                                }}>
                                {CommonUtils.translateMessageCode(
                                  'acceptRoute',
                                )}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null}
                      <Button
                        style={{width: widthPercentageToDP(30)}}
                        onPress={() => {
                          if (Platform.OS === 'ios') {
                            this.props.navigation.navigate(
                              ComponentConstants.GOOGLE_MAP_SCREEN_NAME,
                              {mapRoute: route.googleMap},
                            );
                          } else {
                            this.props.navigation.navigate(
                              ComponentConstants.GOOGLE_MAP_Android_SCREEN_NAME,
                              {mapRoute: route.googleMap},
                            );
                          }
                        }}
                        color="secondary">
                        {CommonUtils.translateMessageCode('viewMap')}
                      </Button>
                    </View>
                  </View>
                </Block>
              </View>
            ))}
          {this.state.mapRoute && this.state.mapRoute.length > 0 ? (
            <Button
              onPress={() => this.SubmitAlert()}
              disabled={this.state.disableSubmit}
              style={styles.button}
              color="secondary">
              {CommonUtils.translateMessageCode('submit')}
            </Button>
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  labelBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    color: ColorConstants.DARKGRAY,
    lineHeight: 25,
    width: widthPercentageToDP(60),
    textAlign: 'right',
  },
  label: {
    lineHeight: 25,
  },
  buttonAccept: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    width: widthPercentageToDP(30),
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1.5),
  },
  actionButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: heightPercentageToDP(1),
  },
  button: {width: widthPercentageToDP(50), alignSelf: 'center'},
});
