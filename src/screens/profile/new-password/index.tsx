import React from 'react';
import {View, Text, TouchableOpacity, Image, BackHandler} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';
import {NewPasswordState} from '../../../types/types';
import {ChangePasswordStyles} from '../../../assets/styles/changePasswordStyles';
import {
  CommonStyles,
  TextInputTheme,
} from '../../../assets/styles/commonStyles';
import {IconConstants} from '../../../constants/iconConstants';
import {ColorConstants} from '../../../constants/colorConstants';
import {CommonUtils} from '../../../utils/commonUtils';
import {ObjectFactory} from '../../../utils/objectFactory';
import Feather from 'react-native-vector-icons/Feather';
import {Context, GlobalContextInput} from '../../../constants/contextConstants';
import {SettingStyles} from '../../../assets/styles/settingStyles';
import {ComponentConstants} from '../../../constants/componentConstants';
import {RespondToAuthChallengeRequest} from '../../../types/requests';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

/**
 * @author <Aniket.P>
 * @description New Password Screen
 * @copyright Supra software solutions, inc
 */
export default class NewPasswordScreen extends React.Component<
  any,
  NewPasswordState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      newPassword: {
        dirty: false,
        valid: false,
        value: '',
      },
      confirmPassword: {
        dirty: false,
        valid: false,
        value: '',
      },
      showPassword: true,
    };
  }

  private resetPassword = async () => {
    const context = this.context as GlobalContextInput;
    const userService = ObjectFactory.getUserService(this.context);
    const respondToAuthChallengeRequest: RespondToAuthChallengeRequest = {
      challengeName: 'NEW_PASSWORD_REQUIRED',
      clientId: '',
      params: {
        username: this.props.route.params.username,
        newPassword: this.state.confirmPassword.value,
      },
      session: this.props.route.params.session,
    };
    const response = await userService.respondToAuthChallenge(
      respondToAuthChallengeRequest,
    );
    if (response.success === true) {
      const sessionInfo =
        await ObjectFactory.getCacheService().getSessionInfo();
      if (sessionInfo.status === 'SETUP_PENDING') {
        if (
          sessionInfo.scopes.includes('transporter') ||
          sessionInfo.scopes.includes('interpreter')
        ) {
          this.props.navigation.navigate(
            ComponentConstants.PERSONAL_INFORMATION_SCREEN_NAME,
          );
        }
      } else {
        context.checkUserIsLoggedIn();
      }
    }
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(ComponentConstants.SETTING_SCREEN_NAME);
    return true;
  };

  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={CommonStyles.container}>
          <View style={SettingStyles.iconContainer}>
            <View style={{paddingVertical: heightPercentageToDP('15%')}}>
              <Text style={{fontWeight: 'bold'}}> Reset Password </Text>
            </View>
          </View>

          <View
            style={{
              ...ChangePasswordStyles.inputBox,
              paddingVertical: heightPercentageToDP('0%'),
            }}>
            <View style={ChangePasswordStyles.action}>
              <TextInput
                label="New Password"
                mode="outlined"
                theme={TextInputTheme}
                style={CommonStyles.textInput}
                autoCapitalize="none"
                onChangeText={(value: string) => {
                  this.setState({
                    newPassword: {
                      dirty: true,
                      valid: value.length >= 8,
                      value,
                    },
                  });
                }}
                onSubmitEditing={() => {}}
              />
              <HelperText
                style={ChangePasswordStyles.helperText}
                type="error"
                visible={
                  this.state.newPassword.dirty && !this.state.newPassword.valid
                }>
                {CommonUtils.translateMessageCode('invalidPasswordText')}
              </HelperText>
            </View>

            <View style={ChangePasswordStyles.action}>
              <TextInput
                secureTextEntry={this.state.showPassword}
                label="Confirm Password"
                mode="outlined"
                theme={TextInputTheme}
                style={CommonStyles.textInput}
                autoCapitalize="none"
                onChangeText={(value: string) => {
                  this.setState({
                    confirmPassword: {
                      dirty: true,
                      valid:
                        value.length >= 8 &&
                        value === this.state.newPassword.value,
                      value,
                    },
                  });
                }}
                onSubmitEditing={() => {}}
              />
              <HelperText
                style={ChangePasswordStyles.helperText}
                type="error"
                visible={
                  this.state.confirmPassword.dirty &&
                  !this.state.confirmPassword.valid
                }>
                {CommonUtils.translateMessageCode('invalidPasswordText')}
              </HelperText>
              <TouchableOpacity
                style={ChangePasswordStyles.passwordTouchable}
                onPress={() => {
                  this.setState({showPassword: !this.state.showPassword});
                }}>
                {!this.state.showPassword ? (
                  <Feather
                    name={IconConstants.EYE}
                    color={ColorConstants.DARKGRAY}
                    size={IconConstants.ICON_SIZE_20}
                  />
                ) : (
                  <Feather
                    name={IconConstants.EYE_OFF}
                    color={ColorConstants.DARKGRAY}
                    size={IconConstants.ICON_SIZE_20}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{...ChangePasswordStyles.footerView}}>
            <Image
              style={ChangePasswordStyles.footerImage}
              source={require('../../../assets/images/splash-bg.png')}
              resizeMode="stretch"
            />
            <View style={ChangePasswordStyles.buttonGroup}>
              <TouchableOpacity
                style={ChangePasswordStyles.changePasswordButton}
                onPress={() => {
                  if (
                    this.state.newPassword.valid &&
                    this.state.confirmPassword.valid
                  ) {
                    if (
                      this.state.newPassword.value.trim() ==
                      this.state.confirmPassword.value.trim()
                    ) {
                      this.resetPassword();
                    }
                  }
                }}>
                <Text style={ChangePasswordStyles.changePasswordText}>
                  {CommonUtils.translateMessageCode('resetPasswordText')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
