import React from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
  Linking,
  StyleSheet,
} from 'react-native';
import {Text, Card} from 'react-native-paper';
import {CommonUtils} from '../utils/commonUtils';
import {InterpretationRequestStyles} from '../assets/styles/InterpretationRequestStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import {Context} from '../constants/contextConstants';
import {CommonStyles} from '../assets/styles/commonStyles';
import {InterpretationRequestState} from '../types/types';
import {ColorConstants} from '../constants/colorConstants';
import {IconConstants} from '../constants/iconConstants';
import {DateUtils} from '../utils/dateUtils';
import {MathUtils} from '../utils/mathUtils';
import {ObjectFactory} from '../utils/objectFactory';
import {ComponentConstants} from '../constants/componentConstants';
import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Button from '../common-components/Button';
import Header from '../common-components/header';

export default class InterpretationRequestScreen extends React.Component<
  any,
  InterpretationRequestState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.route.params.requestService,
    };
    const requestId =
      this.props.route.params.requestId ||
      this.props.route.params.requestService.id;
    if (requestId) {
      this.getServiceRequestDetails(requestId);
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(
      ComponentConstants.INTERPRETATION_SCREEN_NAME,
    );
    return true;
  };

  private getServiceRequestDetails = async (requestId: string) => {
    const response = await ObjectFactory.getRequestService(
      this.context,
    ).getRequestDetails(requestId);
    if (response.success && response.data) {
      this.setState({serviceRequest: response.data});
    }
  };

  private acceptRequest = async () => {
    if (this.state.serviceRequest) {
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).acceptRequest(this.state.serviceRequest.id as any);
      if (response.success) {
        this.getServiceRequestDetails(this.state.serviceRequest.id as any);
        Alert.alert('Awesome!', 'Request has been assigned to you');
      }
    }
  };

  private rejectRequest = async () => {
    if (this.state.serviceRequest) {
      const response = await ObjectFactory.getRequestService(
        this.context,
      ).rejectRequest(this.state.serviceRequest.id as any);
      if (response.success) {
        this.props.navigation.navigate(
          ComponentConstants.INTERPRETATION_SCREEN_NAME,
        );
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
        <Header centerText="Interpretation Request Details" />
        <ScrollView style={{flex: 1}}>
          <Card
            style={{
              marginHorizontal: widthPercentageToDP(3),
              marginVertical: heightPercentageToDP(2),
              borderRadius: 10,
            }}
            elevation={4}>
            {this.state.serviceRequest &&
            this.state.serviceRequest.interpreterRequest ? (
              <View style={InterpretationRequestStyles.detailsContainer}>
                {this.commonView(
                  CommonUtils.translateMessageCode('patientName'),
                  this.state.serviceRequest.appointment.patient.fullName,
                )}
                {this.commonView(
                  CommonUtils.translateMessageCode('patientPhone'),
                  this.state.serviceRequest.appointment.patient.phone,
                )}
                {this.commonView(
                  CommonUtils.translateMessageCode('medicalInterpretation'),
                  this.state.serviceRequest.interpreterRequest
                    .isMedicalInterpretation
                    ? 'Yes'
                    : 'No',
                )}
                {this.commonView(
                  CommonUtils.translateMessageCode('service'),
                  this.state.serviceRequest.interpreterRequest.serviceType,
                )}
                {this.state.serviceRequest.interpreterRequest.serviceType ===
                  'In-Person' && (
                  <>
                    {this.commonView(
                      CommonUtils.translateMessageCode('address'),
                      this.state.serviceRequest.appointment.facility.address
                        .fullAddress,
                    )}
                  </>
                )}
                {this.commonView(
                  'Additional Notes',
                  this.state.serviceRequest.additionalNotes,
                )}

                {this.state.serviceRequest.status === 'Pending' ||
                  (this.state.serviceRequest.status === 'Confirmed' && (
                    <>
                      {this.commonView(
                        CommonUtils.translateMessageCode('language'),
                        this.state.serviceRequest.interpreterRequest.language,
                      )}
                      {this.commonView(
                        CommonUtils.translateMessageCode('estimatedPayOut'),
                        MathUtils.formatCurrency(
                          this.state.serviceRequest.payment.estimatedPayout,
                        ),
                      )}
                    </>
                  ))}

                {this.state.serviceRequest.status === 'Pending' ||
                  (this.state.serviceRequest.status === 'Confirmed' && (
                    <>
                      {this.commonView(
                        CommonUtils.translateMessageCode('appointmentTime'),
                        DateUtils.formatDate(
                          this.state.serviceRequest.appointment.timestamp,
                          DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                        ),
                      )}
                      {this.commonView(
                        CommonUtils.translateMessageCode('estimatedDuration'),
                        DateUtils.getDurationText(
                          this.state.serviceRequest.interpreterRequest
                            .estimatedTime.hours *
                            60 +
                            this.state.serviceRequest.interpreterRequest
                              .estimatedTime.minutes,
                        ),
                      )}
                    </>
                  ))}

                {this.state.serviceRequest.status === 'Completed' && (
                  <>
                    {this.commonView(
                      CommonUtils.translateMessageCode('appointmentTime'),
                      DateUtils.formatDate(
                        this.state.serviceRequest.appointment.date,
                        DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                      ),
                    )}
                    {this.commonView(
                      CommonUtils.translateMessageCode('callDuration'),
                      DateUtils.getDurationText(
                        this.state.serviceRequest.interpreterRequest
                          .estimatedTime.hours * 60,
                      ),
                    )}
                  </>
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

                {this.state.serviceRequest.status === 'Confirmed' &&
                this.state.serviceRequest.interpreterRequest.serviceType ==
                  'Video' ? (
                  <View style={{alignItems: 'center', marginTop: 15}}>
                    <TouchableOpacity
                      style={[
                        InterpretationRequestStyles.button,
                        InterpretationRequestStyles.buttonLeft,
                      ]}
                      onPress={async () => {
                        if (
                          this.state.serviceRequest &&
                          this.state.serviceRequest.appointment.meeting
                        ) {
                          const supported = await Linking.canOpenURL(
                            this.state.serviceRequest?.appointment.meeting
                              ?.joinLink,
                          );
                          if (supported) {
                            await Linking.openURL(
                              this.state.serviceRequest.appointment.meeting
                                .joinLink,
                            );
                          } else {
                            Alert.alert(
                              `Uanble open this URL: ${this.state.serviceRequest.appointment.meeting.joinLink}`,
                            );
                          }
                        }
                      }}>
                      <Text
                        style={InterpretationRequestStyles.buttonLabelCenter}>
                        {CommonUtils.translateMessageCode('joinMeeting')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {this.state.serviceRequest.status === 'Confirmed' &&
                this.state.serviceRequest.interpreterRequest.serviceType !==
                  'Video' ? (
                  <Button
                    style={{
                      width: widthPercentageToDP(50),
                      alignSelf: 'center',
                    }}
                    color="secondary"
                    onPress={() =>
                      this.props.navigation.navigate(
                        ComponentConstants.COMPLETE_REQUEST_SCREEN_NAME,
                        {serviceRequest: this.state.serviceRequest},
                      )
                    }>
                    {CommonUtils.translateMessageCode('complete')}
                  </Button>
                ) : null}
              </View>
            ) : null}

            {this.state.serviceRequest &&
            this.state.serviceRequest.interpreterRequest &&
            this.state.serviceRequest.status === 'Pending' ? (
              <>
                <View
                  style={[
                    InterpretationRequestStyles.actionButtons,
                    {paddingBottom: heightPercentageToDP(3)},
                  ]}>
                  <View style={InterpretationRequestStyles.buttonBox}>
                    <TouchableOpacity
                      style={[
                        InterpretationRequestStyles.button,
                        InterpretationRequestStyles.buttonLeft,
                      ]}
                      onPress={() => this.acceptRequest()}>
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
                {this.state.serviceRequest.interpreterRequest
                  .isImmediateInterpretation && (
                  <Text
                    style={{
                      color: ColorConstants.DARKGRAY,
                      marginHorizontal: widthPercentageToDP(3),
                      marginBottom: heightPercentageToDP(2),
                    }}>
                    Please note that this is an Interpretation Now request. Only
                    accept if you can call back in less than one minute. It is
                    critical that this call is made as soon as you accept this
                    request.
                  </Text>
                )}
              </>
            ) : null}
          </Card>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  labelBox: {
    width: widthPercentageToDP(100),
    flexDirection: 'row',
  },
  subtitle: {
    lineHeight: 25,
  },
  label: {
    lineHeight: 25,
    width: widthPercentageToDP(50),
    color: ColorConstants.DARKGRAY,
    fontWeight: '700',
  },
});
