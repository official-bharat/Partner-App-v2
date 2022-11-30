import React from 'react';
import {
  View,
  TouchableOpacity,
  BackHandler,
  LogBox,
  ScrollView,
} from 'react-native';
import {Text} from 'react-native-paper';
import {CommonUtils} from '../../../utils/commonUtils';
import {InterpretationRequestStyles} from '../../../assets/styles/InterpretationRequestStyles';
import Feather from 'react-native-vector-icons/Feather';
import {Context} from '../../../constants/contextConstants';
import {CommonStyles} from '../../../assets/styles/commonStyles';
import {TransportRequestState} from '../../../types/types';
import {ColorConstants} from '../../../constants/colorConstants';
import {IconConstants} from '../../../constants/iconConstants';
import {DateUtils} from '../../../utils/dateUtils';
import {ObjectFactory} from '../../../utils/objectFactory';
import {ComponentConstants} from '../../../constants/componentConstants';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Button from '../../../common-components/Button';
import Block from '../../../common-components/Block';
import Header from '../../../common-components/header';

/**
 * @author <Azhar.K>
 * @description Transportation Request Screen
 * @copyright Supra software solutions, inc
 */
export default class TransportRequestScreen extends React.Component<
  any,
  TransportRequestState
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
      loader: false,
    };
    if (this.props.route.params.requestService.id) {
      this.getServiceRequestDetails(this.props.route.params.requestService.id);
    }
  }
  getRoutes() {
    const routes = [];
    if (this.state.route1) {
      routes.push(this.state.route1);
    }
    if (this.state.route2) {
      routes.push(this.state.route2);
    }
    return routes;
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
    this.props.navigation.navigate(
      ComponentConstants.TRANSPORTATION_SCREEN_NAME,
      {status: this.state.serviceRequest?.status},
    );
    return true;
  };

  private getServiceRequestDetails = async (requestId: string) => {
    this.setState({
      loader: true,
    });
    const response = await ObjectFactory.getRequestService(
      this.context,
    ).getRequestDetails(requestId);
    if (response.success && response.data) {
      this.setState({serviceRequest: response.data});
      this.setState({
        loader: false,
      });
      if (
        response.data.transportRequest &&
        response.data.transportRequest.mapRoutes &&
        response.data.transportRequest.mapRoutes.length === 2
      ) {
        this.setState({
          route1: response.data.transportRequest.mapRoutes[0],
          route2: response.data.transportRequest.mapRoutes[1],
        });
        this.setState({
          loader: false,
        });
      } else if (
        response.data.transportRequest &&
        response.data.transportRequest.mapRoutes &&
        response.data.transportRequest.mapRoutes.length === 1
      ) {
        this.setState({
          route1: response.data.transportRequest.mapRoutes[0],
        });
        this.setState({
          loader: false,
        });
      }
    }
    if (this.state.route1) {
      this.setState({tab1: true});
    }
    if (this.state.route2) {
      this.setState({tab2: true});
    }
  };

  private rejectRequest = async () => {
    if (this.state.serviceRequest) {
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).rejectRequest(this.state.serviceRequest.id as any);
      if (response.success) {
        this.props.navigation.navigate(
          ComponentConstants.TRANSPORTATION_SCREEN_NAME,
        );
      }
    }
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Request Details" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: heightPercentageToDP(2),
          }}>
          {this.state.serviceRequest &&
          this.state.serviceRequest.transportRequest ? (
            <View style={InterpretationRequestStyles.detailsContainer}>
              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>{CommonUtils.translateMessageCode('patientName')}</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.patient.fullName}
                  </Text>
                </View>

                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>
                    {CommonUtils.translateMessageCode('patientPhone')}
                  </Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.patient.phone}
                  </Text>
                </View>
              </View>

              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>Healthcare Provider</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.appointment.facility.name}
                  </Text>
                </View>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>Service</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    Transportation
                  </Text>
                </View>
              </View>

              <View style={InterpretationRequestStyles.labelContainer}>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>{CommonUtils.translateMessageCode('transport')}</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.transportRequest.transport}
                  </Text>
                </View>
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>{CommonUtils.translateMessageCode('visitType')}</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.transportRequest.visitType}
                  </Text>
                </View>
              </View>

              <View style={InterpretationRequestStyles.labelContainer}>
                {
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text>{'Bariatric Services Required'}</Text>
                    <Text style={InterpretationRequestStyles.label}>
                      {this.state.serviceRequest.transportRequest
                        .isBariatricServiceRequired
                        ? 'Yes'
                        : this.state.serviceRequest.appointment.patient
                            .patientHeight ||
                          this.state.serviceRequest.appointment.patient
                            .patientWeight
                        ? 'Not Sure'
                        : 'No'}
                    </Text>
                  </View>
                }
                {this.state.serviceRequest.appointment.patient.patientHeight ? (
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text>{"Patient' height"}</Text>
                    <Text style={InterpretationRequestStyles.label}>
                      {this.state.serviceRequest.appointment.patient
                        .patientHeight.feet + ' Feet'}{' '}
                      {this.state.serviceRequest.appointment.patient
                        .patientHeight.inch
                        ? this.state.serviceRequest.appointment.patient
                            .patientHeight.inch + ' Inch'
                        : ''}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                {this.state.serviceRequest.appointment.patient.patientWeight ? (
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text>{"Patient' Weight"}</Text>
                    <Text style={InterpretationRequestStyles.label}>
                      {
                        this.state.serviceRequest.appointment.patient
                          .patientWeight
                      }{' '}
                      Pound
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>{'Oxygen Tank Required'}</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.transportRequest
                      .isOxygenTankRequired
                      ? 'Yes'
                      : 'No'}
                  </Text>
                </View>
              </View>

              {this.state.serviceRequest.status === 'Pending' ||
              this.state.serviceRequest.status === 'Confirmed' ? (
                <View style={InterpretationRequestStyles.labelContainer}>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text>
                      {CommonUtils.translateMessageCode('appointmentTime')}
                    </Text>
                    <Text style={InterpretationRequestStyles.label}>
                      {DateUtils.formatDate(
                        this.state.serviceRequest.appointment.timestamp,
                        DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                      )}
                    </Text>
                  </View>
                  {this.state.route2 ? (
                    <View style={InterpretationRequestStyles.labelBox}>
                      <Text>
                        {CommonUtils.translateMessageCode('estimatedVisitTime')}
                      </Text>
                      <Text style={InterpretationRequestStyles.label}>
                        {DateUtils.getDurationText(
                          this.state.serviceRequest.transportRequest
                            .estimatedVisitTime.hours *
                            60 +
                            this.state.serviceRequest.transportRequest
                              .estimatedVisitTime.minutes,
                        )}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              ) : null}
              {this.state.serviceRequest.additionalNotes ? (
                <View style={InterpretationRequestStyles.labelBox}>
                  <Text>{'Additional Notes'}</Text>
                  <Text style={InterpretationRequestStyles.label}>
                    {this.state.serviceRequest.additionalNotes}
                  </Text>
                </View>
              ) : (
                <></>
              )}

              {this.state.serviceRequest.status === 'Completed' ? (
                <View style={InterpretationRequestStyles.labelContainer}>
                  <View style={InterpretationRequestStyles.labelBox}>
                    <Text>
                      {CommonUtils.translateMessageCode('appointmentTime')}
                    </Text>
                    <Text style={InterpretationRequestStyles.label}>
                      {DateUtils.formatDate(
                        this.state.serviceRequest.appointment.date,
                        DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                      )}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {this.state.serviceRequest &&
          this.state.serviceRequest.transportRequest &&
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
          <Block
            flex={false}
            margin={[heightPercentageToDP(4), widthPercentageToDP(5), 0]}>
            <Button
              onPress={() =>
                this.props.navigation.navigate(
                  ComponentConstants.ROUTE_DETAIL_SCREEN_NAME,
                  {
                    data: this.getRoutes(),
                    serviceRequest: this.state.serviceRequest,
                  },
                )
              }
              color="secondary">
              Route Details
            </Button>
          </Block>
        </ScrollView>
      </View>
    );
  }
}
