import React from 'react';
import {
  View,
  TouchableOpacity,
  BackHandler,
  LogBox,
  StyleSheet,
} from 'react-native';
import {Text} from 'react-native-paper';
import {CommonUtils} from '../utils/commonUtils';
import {InterpretationRequestStyles} from '../assets/styles/InterpretationRequestStyles';
import Feather from 'react-native-vector-icons/Feather';
import {Context} from '../constants/contextConstants';
import {CommonStyles} from '../assets/styles/commonStyles';
import {DeliveryRequestState} from '../types/types';
import {ColorConstants} from '../constants/colorConstants';
import {IconConstants} from '../constants/iconConstants';
import {DateUtils} from '../utils/dateUtils';
import {ObjectFactory} from '../utils/objectFactory';
import {ComponentConstants} from '../constants/componentConstants';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../common-components/header';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Button from '../common-components/Button';
import Block from '../common-components/Block';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../utils/common-utils';

/**
 * @author <Amol.D>
 * @description Delivery Request Screen
 * @copyright Supra software solutions, inc
 */
export default class DeliveryRequestScreen extends React.Component<
  any,
  DeliveryRequestState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.route.params.requestService,
      mapView: undefined,
      route1: undefined,
      route2: undefined,
      viewMap: false,
      tab1: false,
      tab2: false,
    };
    if (this.props.route.params.requestService.id) {
      this.getServiceRequestDetails(this.props.route.params.requestService.id);
    }
  }

  componentDidMount() {
    LogBox.ignoreAllLogs();
    this.props.navigation.addListener('focus', () => {
      this.getServiceRequestDetails(this.props.route.params.requestService.id);
    });
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(ComponentConstants.DELIVERY_SCREEN_NAME, {
      status: this.state.serviceRequest?.status,
    });
    return true;
  };

  private getServiceRequestDetails = async (requestId: string) => {
    const response = await ObjectFactory.getRequestService(
      this.context,
    ).getRequestDetails(requestId);
    if (response.success && response.data) {
      this.setState({serviceRequest: response.data});
      if (
        response.data.deliveryRequest &&
        response.data.deliveryRequest.mapRoutes
      ) {
        this.setState({
          route1: response.data.deliveryRequest.mapRoutes[0],
          route2: response.data.deliveryRequest.mapRoutes[1],
        });
      }
    }
    if (this.state.route1) {
      this.setState({tab1: true});
    }
    if (this.state.route2) {
      this.setState({tab2: true});
    }
    if (
      this.state.serviceRequest?.deliveryRequest?.mapRoutes[0].status ===
      'In-Progress'
    ) {
      this.props.navigation.navigate(
        ComponentConstants.GOOGLE_MAP_SCREEN_NAME,
        {
          routeId: this.state.serviceRequest?.deliveryRequest?.mapRoutes[0].id,
          requestId: this.state.serviceRequest?.id,
          serviceRequest: this.state.serviceRequest,
          mapRoute:
            this.state.serviceRequest?.deliveryRequest?.mapRoutes[0].googleMap,
          type: 'Delivery',
          deliveryRoutes: [this.state.route1, this.state.route2 || []],
        },
      );
    }
  };

  private rejectRequest = async () => {
    if (this.state.serviceRequest) {
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).rejectRequest(this.state.serviceRequest.id as any);
      if (response.success) {
        this.props.navigation.navigate(ComponentConstants.DELIVERY_SCREEN_NAME);
      }
    }
  };

  commonView = (label: any, value: any) => {
    return (
      <View style={styles.labelBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{value}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Delivery Request Details" />
        <ScrollView style={{flex: 1}}>
          {this.state.serviceRequest &&
          this.state.serviceRequest.deliveryRequest ? (
            <View
              style={[
                InterpretationRequestStyles.detailsContainer,
                {marginLeft: 5},
              ]}>
              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>
                    {CommonUtils.translateMessageCode('customerName')}
                  </Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.patient.fullName}
                  </Text>
                </View>

                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>
                    {CommonUtils.translateMessageCode('customerPhone')}
                  </Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.patient.phone}
                  </Text>
                </View>
              </View>

              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>
                    {CommonUtils.translateMessageCode('customerEmail')}
                  </Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.patient.email}
                  </Text>
                </View>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>Service</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    Medication Delivery
                  </Text>
                </View>
              </View>

              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>Business Name</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.facility.name}
                  </Text>
                </View>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>Business Closing Time</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {
                      this.state.serviceRequest.deliveryRequest
                        .businessCloseTime
                    }
                  </Text>
                </View>
              </View>

              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>
                    {CommonUtils.translateMessageCode('deliveryTime')}
                  </Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {DateUtils.formatDate(
                      this.state.serviceRequest.appointment.timestamp,
                      DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                    )}
                  </Text>
                </View>
              </View>
              {this.commonView(
                'Delivery Address',
                strictValidObjectWithKeys(
                  this.state.serviceRequest.deliveryRequest,
                ) &&
                  strictValidArrayWithLength(
                    this.state.serviceRequest.deliveryRequest.mapRoutes,
                  ) &&
                  this.state.serviceRequest.deliveryRequest.mapRoutes[0]
                    .dropoffAddress.fullAddress,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('pickupAddress'),
                strictValidObjectWithKeys(
                  this.state.serviceRequest.deliveryRequest,
                ) &&
                  strictValidArrayWithLength(
                    this.state.serviceRequest.deliveryRequest.mapRoutes,
                  ) &&
                  this.state.serviceRequest.deliveryRequest.mapRoutes[0]
                    .pickupAddress.fullAddress,
              )}
              {this.commonView(
                'Additional Notes',
                this.state.serviceRequest.additionalNotes,
              )}

              {/* <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.submittedAt}>
                  <Text style={InterpretationRequestStyles.label}>
                    {CommonUtils.translateMessageCode('submittedAt')} :{' '}
                    {DateUtils.formatDate(
                      this.state.serviceRequest.appointment.date,
                      DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                    )}
                  </Text>
                </View>
              </View> */}
            </View>
          ) : null}

          {this.state.serviceRequest &&
          this.state.serviceRequest.deliveryRequest &&
          this.state.serviceRequest.status === 'Pending' ? (
            <View style={[InterpretationRequestStyles.actionButtons]}>
              <View style={InterpretationRequestStyles.buttonBox}>
                <TouchableOpacity
                  style={[
                    InterpretationRequestStyles.button,
                    InterpretationRequestStyles.buttonLeft,
                  ]}
                  onPress={() =>
                    this.props.navigation.navigate(
                      ComponentConstants.ACCEPT_REQUEST_SCREEN_NAME,
                      {serviceRequest: this.state.serviceRequest},
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
                      this.rejectRequest,
                      undefined,
                      CommonUtils.translateMessageCode('rejectOpportunity'),
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
          ) : null}

          <Block flex={false} padding={[0, widthPercentageToDP(5)]}>
            {strictValidObjectWithKeys(
              this.state.serviceRequest?.deliveryRequest,
            ) &&
              strictValidArrayWithLength(
                this.state.serviceRequest?.deliveryRequest?.mapRoutes,
              ) && (
                <>
                  {this.state.serviceRequest?.deliveryRequest?.mapRoutes[0]
                    .driverName &&
                    this.context.sessionInfo.scopes.includes('transporter') &&
                    this.state.serviceRequest?.deliveryRequest?.mapRoutes[0]
                      .status === 'Accepted' && (
                      <Button
                        onPress={() =>
                          this.props.navigation.navigate(
                            ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME,
                            {
                              routeId:
                                this.state.serviceRequest?.deliveryRequest
                                  ?.mapRoutes[0].id,
                              serviceRequest: this.state.serviceRequest,
                              title: 'Change Driver',
                            },
                          )
                        }
                        color="secondary">
                        Change Driver
                      </Button>
                    )}
                </>
              )}
            {
              <>
                {strictValidObjectWithKeys(
                  this.state.serviceRequest?.deliveryRequest,
                ) &&
                  strictValidArrayWithLength(
                    this.state.serviceRequest?.deliveryRequest?.mapRoutes,
                  ) &&
                  !this.state.serviceRequest?.deliveryRequest?.mapRoutes[0]
                    .driverName &&
                  this.state.serviceRequest?.deliveryRequest?.mapRoutes[0]
                    .status === 'Accepted' && (
                    <Button
                      style={{width: widthPercentageToDP(42)}}
                      onPress={() =>
                        this.props.navigation.navigate(
                          ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME,
                          {
                            routeId:
                              this.state.serviceRequest?.deliveryRequest
                                ?.mapRoutes[0].id,
                            serviceRequest: this.state.serviceRequest,
                            title: 'Assign Driver',
                          },
                        )
                      }
                      color="secondary">
                      {CommonUtils.translateMessageCode('assignDriver')}
                    </Button>
                  )}
              </>
            }
          </Block>
          {this.state.serviceRequest?.status === 'Confirmed' && (
            <Block
              flex={false}
              margin={[heightPercentageToDP(2), widthPercentageToDP(5), 0]}>
              <Button
                onPress={() =>
                  this.props.navigation.navigate(
                    ComponentConstants.GOOGLE_MAP_SCREEN_NAME,
                    {
                      routeId:
                        this.state.serviceRequest?.deliveryRequest?.mapRoutes[0]
                          .id,
                      requestId: this.state.serviceRequest?.id,
                      serviceRequest: this.state.serviceRequest,
                      mapRoute:
                        this.state.serviceRequest?.deliveryRequest?.mapRoutes[0]
                          .googleMap,
                      type: 'Delivery',
                      deliveryRoutes: [
                        this.state.route1,
                        this.state.route2 || [],
                      ],
                    },
                  )
                }
                color="secondary">
                Start Delivery
              </Button>
            </Block>
          )}
          {/* {this.state.serviceRequest?.status !== 'Completed' &&
            this.state.serviceRequest?.status !== 'Pending' && (
              <Block
                flex={false}
                margin={[heightPercentageToDP(2), widthPercentageToDP(5), 0]}>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate(
                      ComponentConstants.DELIVERY_DETAIL_SCREEN_NAME,
                      {
                        data: [this.state.route1, this.state.route2 || []],
                        serviceRequest: this.state.serviceRequest,
                      },
                    )
                  }
                  color="secondary">
                  Complete Delivery
                </Button>
              </Block>
            )} */}
          {/* <View>
            <Tab.Navigator>
              <Tab.Screen
                name="Delivery Address"
                component={(props) => (
                  <RouteTab
                    navigation={this.props.navigation}
                    serviceRequest={this.state.serviceRequest}
                    route={this.state.route1}
                  />
                )}
              />
              {this.state.tab2 ? (
                <Tab.Screen
                  name="Route B"
                  component={(props) => (
                    <RouteTab
                      navigation={this.props.navigation}
                      serviceRequest={this.state.serviceRequest}
                      route={this.state.route2}
                    />
                  )}
                />
              ) : null}
            </Tab.Navigator>
          </View> */}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  labelBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
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
});
