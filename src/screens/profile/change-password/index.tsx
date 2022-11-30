import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper';
import {ChangePasswordState} from '../../../types/types';
import {ChangePasswordStyles} from '../../../assets/styles/changePasswordStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  CommonStyles,
  TextInputTheme,
} from '../../../assets/styles/commonStyles';
import {IconConstants} from '../../../constants/iconConstants';
import {ColorConstants} from '../../../constants/colorConstants';
import {CommonUtils} from '../../../utils/commonUtils';
import {ObjectFactory} from '../../../utils/objectFactory';
import Feather from 'react-native-vector-icons/Feather';
import {Context} from '../../../constants/contextConstants';
import {SettingStyles} from '../../../assets/styles/settingStyles';
import {ComponentConstants} from '../../../constants/componentConstants';
import {ChangePasswordRequest} from '../../../types/requests';
import Header from '../../../common-components/header';
/**
 * @author <Aniket.P>
 * @description Change Password Screen
 * @copyright Supra software solutions, inc
 */
export default class ChangePasswordScreen extends React.Component<
  any,
  ChangePasswordState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      oldPassword: {
        dirty: false,
        valid: false,
        value: '',
      },
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

  private changePassword = async () => {
    const userService = ObjectFactory.getUserService(this.context);
    const passwordChangeRequest: ChangePasswordRequest = {
      oldPassword: this.state.oldPassword.value,
      newPassword: this.state.newPassword.value,
      userId: this.context.sessionInfo.userId,
    };
    const response = await userService.changePassword(passwordChangeRequest);
    if (response.success === true) {
      Alert.alert('Success!', 'Password Changed Successfully. Please relogin');
      CommonUtils.logout();
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
      <View style={CommonStyles.container}>
        <Header centerText="Change Password" />
        <View style={ChangePasswordStyles.inputBox}>
          <View style={ChangePasswordStyles.action}>
            <TextInput
              label="Old Password"
              mode="outlined"
              theme={TextInputTheme}
              style={CommonStyles.textInput}
              autoCapitalize="none"
              onChangeText={(value: string) => {
                this.setState({
                  oldPassword: {
                    dirty: true,
                    valid: value.length >= 1,
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
                this.state.oldPassword.dirty && !this.state.oldPassword.valid
              }>
              {CommonUtils.translateMessageCode('invalidPasswordText')}
            </HelperText>
          </View>

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

        <View style={ChangePasswordStyles.footerView}>
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
                  this.state.oldPassword.valid &&
                  this.state.newPassword.valid &&
                  this.state.confirmPassword.valid
                ) {
                  if (
                    this.state.newPassword.value.trim() ==
                    this.state.confirmPassword.value.trim()
                  )
                    this.changePassword();
                }
              }}>
              <Text style={ChangePasswordStyles.changePasswordText}>
                {CommonUtils.translateMessageCode('changePasswordText')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
