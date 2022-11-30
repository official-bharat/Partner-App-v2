import React from 'react';
import {View, TouchableOpacity, BackHandler, LogBox, Alert} from 'react-native';
import {
  CommonStyles,
  TextInputTheme,
} from '../../../assets/styles/commonStyles';
import {
  CompleteCmrRequest,
  CompleteCRMRequestState,
  CompleteDeliveryRequestState,
} from '../../../types/types';
import {CommonUtils} from '../../../utils/commonUtils';
import {ObjectFactory} from '../../../utils/objectFactory';
import {ComponentConstants} from '../../../constants/componentConstants';
import {Context} from '../../../constants/contextConstants';
import {InterpretationRequestStyles} from '../../../assets/styles/InterpretationRequestStyles';
import {SettingStyles} from '../../../assets/styles/settingStyles';
import {ColorConstants} from '../../../constants/colorConstants';
import {
  Appbar,
  Divider,
  HelperText,
  Menu,
  RadioButton,
  TextInput,
} from 'react-native-paper';
import {LoginStyles} from '../../../assets/styles/loginStyles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Header from '../../../common-components/header';
import Button from '../../../common-components/Button';
import {ApiRequest, ApiResponse} from '../../../services/util/iHttpService';
import {URLConstants} from '../../../constants/urlConstants';
import {getAsync} from '../../../utils/local-storage';
import {InterpretationStyles} from '../../../assets/styles/interpretationStyles';
import {IconConstants} from '../../../constants/iconConstants';
import Block from '../../../common-components/Block';
import Text from '../../../common-components/Text';
import {strictValidString} from '../../../utils/common-utils';
import {CompleteRequest} from '../../../types/types';
import {CommonConstants} from '../../../constants/commonConstants';

const AppConstant = require('../../../../app.json');

export default class CompleteCMRScreen extends React.Component<
  any,
  CompleteCRMRequestState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.route.params.serviceRequest,
      requestId: this.props.route.params.requestId,
      ableToReach: false,
      openMenu: false,
      isReviewCompleted: false,
      isOptOutOfCMR: false,
      inCompleteReviewReason: '',
      comments: '',
    };
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

  changeOption = (text: string) => {
    this.setState({inCompleteReviewReason: text, openMenu: false});
  };

  private async completeTrip() {
    const completeCmrRequest: CompleteCmrRequest = {
      ableToReach: this.state.ableToReach,
      inCompleteReviewReason: this.state.inCompleteReviewReason,
      isOptOutOfCMR: this.state.isOptOutOfCMR,
      isReviewCompleted: this.state.isReviewCompleted,
      comments: this.state.comments,
    };

    const completeRequest: CompleteRequest = {
      completeCmrRequest,
    };

    const response = await ObjectFactory.getRequestService(
      this.context,
    ).completeRequest(this.state.requestId, completeRequest);

    if (response.success) {
      this.props.navigation.navigate(ComponentConstants.CMR_SCREEN_NAME);
    }
  }
  checkDisabled = () => {
    if (!this.state.ableToReach) {
      return false;
    } else if (
      strictValidString(this.state.inCompleteReviewReason) &&
      this.state.ableToReach
    ) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const {requestId, serviceRequest} = this.state;
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Complete CMR Request" />
        <Block
          flex={false}
          margin={[heightPercentageToDP(2), widthPercentageToDP(3), 0]}>
          <Text size={14}>Were you ablet to reach the patient ?</Text>
          <Block flex={false} margin={[heightPercentageToDP(1), 0, 0]}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (newValue) {
                  this.setState({
                    ableToReach: true,
                    isReviewCompleted: false,
                    isOptOutOfCMR: false,
                    inCompleteReviewReason: '',
                    comments: '',
                  });
                } else {
                  this.setState({
                    ableToReach: false,
                    isReviewCompleted: false,
                  });
                }
              }}
              value={this.state.ableToReach}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <RadioButton value={true} color={ColorConstants.GREEN} />
                  <RadioButton value={false} color={ColorConstants.GREEN} />
                </View>
                <View>
                  <Text
                    onPress={() => {
                      this.setState({
                        ableToReach: true,
                        isReviewCompleted: true,
                      });
                    }}
                    style={{marginTop: '35%'}}>
                    Yes
                  </Text>
                  <Text
                    onPress={() => {
                      this.setState({
                        ableToReach: false,
                      });
                    }}
                    style={{marginTop: '70%'}}>
                    No
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </Block>
        </Block>

        <Block flex={false} margin={[0, widthPercentageToDP(3)]}>
          <Text size={14}>
            Was the Comprehensive Medication Review successfully completed ?
          </Text>

          <Block flex={false} margin={[heightPercentageToDP(1), 0, 0]}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (newValue) {
                  this.setState({
                    isReviewCompleted: true,
                  });
                } else {
                  this.setState({
                    isReviewCompleted: false,
                  });
                }
              }}
              value={this.state.isReviewCompleted}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <RadioButton value={true} color={ColorConstants.GREEN} />
                  <RadioButton value={false} color={ColorConstants.GREEN} />
                </View>
                <View>
                  <Text
                    onPress={() => {
                      this.setState({
                        isReviewCompleted: true,
                      });
                    }}
                    style={{marginTop: '35%'}}>
                    Yes
                  </Text>
                  <Text
                    onPress={() => {
                      this.setState({
                        isReviewCompleted: false,
                      });
                    }}
                    style={{marginTop: '70%'}}>
                    No
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </Block>
        </Block>

        {this.state.ableToReach && (
          <Block padding={[0, widthPercentageToDP(5)]} center flex={false}>
            <View style={InterpretationRequestStyles.labelCompleteCmr}>
              <Text
                style={[
                  InterpretationRequestStyles.labelCompleteLine,
                  {fontSize: 16, lineHeight: 20},
                ]}>
                {
                  'Was there a reason why the patient did not call thieir health insurance provider back?'
                }
              </Text>
            </View>
            <TouchableOpacity
              style={[
                InterpretationStyles.menuView,
                {
                  justifyContent: 'space-between',
                  height: heightPercentageToDP(5),
                  width: widthPercentageToDP(90),
                  marginRight: 0,
                  marginVertical: heightPercentageToDP(1),
                },
              ]}
              onPress={() => this.setState({openMenu: true})}>
              <Text margin={[0, widthPercentageToDP(3)]}>
                {this.state.inCompleteReviewReason || 'Choose Reason'}
              </Text>
              <Menu
                style={{width: widthPercentageToDP(90)}}
                onDismiss={() => this.setState({openMenu: false})}
                visible={this.state.openMenu}
                anchor={
                  <Appbar.Action
                    style={InterpretationStyles.menuAction}
                    color={ColorConstants.GREEN}
                    icon={IconConstants.MENU_DOWN}
                    onPress={() => this.setState({openMenu: true})}
                    size={IconConstants.ICON_SIZE_30}
                  />
                }>
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Did not receive phone calls'}
                  onPress={() => {
                    this.changeOption('Did not receive phone calls');
                  }}
                />
                <Divider />
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Did not receive voicemails'}
                  onPress={() => {
                    this.changeOption('Did not receive voicemails');
                  }}
                />
                <Divider />
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Incorrect phone number'}
                  onPress={() => {
                    this.changeOption('Incorrect phone number');
                  }}
                />
                <Divider />
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Thought the calls might be a scam'}
                  onPress={() => {
                    this.changeOption('Thought the calls might be a scam');
                  }}
                />
                <Divider />
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Did not feel well enough to speak to anyone'}
                  onPress={() => {
                    this.changeOption(
                      'Did not feel well enough to speak to anyone',
                    );
                  }}
                />
                <Divider />
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Language Barrier - Does not speak english'}
                  onPress={() => {
                    this.changeOption(
                      'Language Barrier - Does not speak english',
                    );
                  }}
                />
                <Divider />
                <Menu.Item
                  contentStyle={{width: widthPercentageToDP(100)}}
                  title={'Other'}
                  onPress={() => {
                    this.changeOption('Other');
                  }}
                />
              </Menu>
            </TouchableOpacity>
          </Block>
        )}

        {this.state.inCompleteReviewReason === 'Other' && (
          <Block flex={false} margin={[heightPercentageToDP(1), 0, 0]}>
            <TextInput
              label="Other Reason"
              mode="outlined"
              theme={TextInputTheme}
              value={this.state.comments}
              style={[
                CommonStyles.textInput,
                {
                  height: heightPercentageToDP(5),
                  marginHorizontal: widthPercentageToDP(5),
                },
              ]}
              autoCapitalize="none"
              onChangeText={(value: string) => {
                this.setState({
                  comments: value,
                });
              }}
              onSubmitEditing={() => {}}
            />
          </Block>
        )}

        {this.state.ableToReach && (
          <Block flex={false} margin={[0, widthPercentageToDP(3)]}>
            <Text size={14}>Did the patient request to opt-out of CMR ?</Text>

            <Block flex={false} margin={[heightPercentageToDP(1), 0, 0]}>
              <RadioButton.Group
                onValueChange={(newValue) => {
                  this.setState({isOptOutOfCMR: newValue});
                }}
                value={this.state.isOptOutOfCMR}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <RadioButton value={true} color={ColorConstants.GREEN} />
                    <RadioButton value={false} color={ColorConstants.GREEN} />
                  </View>
                  <View>
                    <Text
                      onPress={() => {
                        this.setState({isOptOutOfCMR: true});
                      }}
                      style={{marginTop: '35%'}}>
                      Yes
                    </Text>
                    <Text
                      onPress={() => {
                        this.setState({isOptOutOfCMR: false});
                      }}
                      style={{marginTop: '70%'}}>
                      No
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
            </Block>
          </Block>
        )}

        <Block flex={false} padding={[0, widthPercentageToDP(5)]}>
          <Button
            onPress={() => {
              this.completeTrip(requestId);
            }}
            disabled={this.checkDisabled()}
            color={'secondary'}>
            {'Complete'}
          </Button>
        </Block>
      </View>
    );
  }
}
