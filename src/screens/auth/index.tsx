import React from 'react';
import {View, Image, Text, Alert, BackHandler} from 'react-native';
import {LoginStyles} from '../../assets/styles/loginStyles';
import {ColorConstants} from '../../constants/colorConstants';
import {HelperText, TextInput} from 'react-native-paper';
import {
  CommonStyles,
  logo,
  TextInputTheme,
} from '../../assets/styles/commonStyles';
import {CommonUtils} from '../../utils/commonUtils';
import {IconConstants} from '../../constants/iconConstants';
import Feather from 'react-native-vector-icons/Feather';
import {LoginState} from '../../types/types';
import {ObjectFactory} from '../../utils/objectFactory';
import {Context, GlobalContextInput} from '../../constants/contextConstants';
import {ComponentConstants} from '../../constants/componentConstants';
import TouchID from 'react-native-touch-id';
import {getAsync, saveAsync} from '../../utils/local-storage';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {strictValidObjectWithKeys} from '../../utils/common-utils';
import SimpleToast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Block from '../../common-components/Block';
import Button from '../../common-components/Button';

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};
export default class LoginScreen extends React.Component<any, LoginState> {
  static contextType = Context.GlobalContext;

  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      email: '',
      emailValid: false,
      password: '',
      passwordValid: false,
      showPassword: true,
      isSupported: false,
      faceId: this.props.route.params.bio,
    };
  }

  private validLoginForm = (value: string, key: string) => {
    if (key === 'email') {
      this.setState({email: value});

      // && value.includes('@') && value.substring(value.lastIndexOf(".") +1)
      if (value.trim().length >= 4) {
        this.setState({emailValid: false});
      } else {
        this.setState({emailValid: true});
      }
    } else {
      this.setState({password: value});
      if (value.trim().length >= 8) {
        this.setState({passwordValid: false, password: value});
      } else {
        this.setState({passwordValid: true});
      }
    }
  };

  private backAction = () => {
    Alert.alert('', 'Are you sure that you want to exit?', [
      {text: 'No', onPress: () => null, style: 'cancel'},
      {text: 'Yes', onPress: () => BackHandler.exitApp(), style: 'default'},
    ]);
    return true;
  };

  private async doLogin() {
    const context = this.context as GlobalContextInput;
    const userService = ObjectFactory.getUserService(this.context);
    const response = await userService.login({
      password: this.state.password,
      username: this.state.email,
    });
    if (response.success) {
      saveAsync('bioauth', {
        password: this.state.password,
        username: this.state.email,
      });
    }
    if (response.success && typeof response.data === 'string') {
      // Redirect to home page

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
    } else if (response.success && typeof response.data === 'object') {
      if (response.data.challengeName === 'NEW_PASSWORD_REQUIRED') {
        this.props.navigation.navigate(
          ComponentConstants.NEW_PASSWORD_SCREEN_NAME,
          {
            username: this.state.email,
            session: response.data.session,
          },
        );
      }
    } else {
      CommonUtils.showError(response);
    }
  }

  authenticateWithUserAndPassword = async () => {
    const bioauthRes = await getAsync('bioauth');
    this.setState({
      email: bioauthRes.username,
      password: bioauthRes.password,
    });
    if (bioauthRes) {
      TouchID.authenticate(
        'to demo this react-native component',
        optionalConfigObject,
      )
        .then(() => {
          this.doLogin();
        })
        .catch(() => {});
    }
  };

  _pressHandler = async () => {
    const res = await TouchID.isSupported();
    if (res) {
      this.setState({
        isSupported: true,
      });
    } else {
      this.setState({
        isSupported: false,
      });
    }
  };

  checkBiometric = async () => {
    const bioauthRes = await getAsync('bioauth');
    if (!bioauthRes) {
      SimpleToast.show('Please Try to login with user details');
    } else {
      const res = await this._pressHandler();
      if (this.state.isSupported) {
        this.authenticateWithUserAndPassword();
      }
    }
  };

  updateBioAuth = async () => {
    const bioauthRes = await getAsync('bioauth');
    const val = strictValidObjectWithKeys(bioauthRes) ? true : false;
    this.setState({
      faceId: val,
    });
    if (val) {
      this.checkBiometric();
    }
  };

  componentDidMount() {
    this.updateBioAuth();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Block margin={[heightPercentageToDP(2), 0]} center={true} flex={false}>
          <Block flex={false} margin={[heightPercentageToDP(2), 0]}>
            <Image
              style={LoginStyles.logo}
              source={logo}
              resizeMode="stretch"
            />
          </Block>
        </Block>

        <View style={{alignItems: 'center'}}>
          <Text style={LoginStyles.partnerText}>
            {CommonUtils.translateMessageCode('loginPartnerText')}
          </Text>
        </View>
        <TextInput
          theme={TextInputTheme}
          style={CommonStyles.textInput}
          label="Email"
          placeholder="Email"
          value={this.state.email}
          autoCapitalize="none"
          mode="outlined"
          onChangeText={(value: string) => this.validLoginForm(value, 'email')}
          returnKeyType={'next'}
          keyboardType="email-address"
        />
        <HelperText
          style={LoginStyles.helperText}
          type="error"
          visible={this.state.emailValid}>
          {CommonUtils.translateMessageCode('invalidUsernameText')}
        </HelperText>
        {/* <View>
          {this.state.faceId && (
            <TouchableOpacity onPress={() => this.checkBiometric()}>
              <Image source={images.face_id} style={LoginStyles.faceId} />
            </TouchableOpacity>
          )}
        </View> */}
        {/* <TextInput
          secureTextEntry={this.state.showPassword}
          theme={TextInputTheme}
          style={CommonStyles.textInput}
          label="Password"
          autoCapitalize="none"
          mode="outlined"
          onChangeText={(value: string) => this.validLoginForm(value, '')}
          onSubmitEditing={() => {}}
        />
        <HelperText
          style={LoginStyles.helperText}
          type="error"
          visible={this.state.passwordValid}>
          {CommonUtils.translateMessageCode('invalidPasswordText')}
        </HelperText>
        <TouchableOpacity
          style={LoginStyles.passwordTouchable}
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
        </TouchableOpacity> */}
        <TextInput
          theme={TextInputTheme}
          style={CommonStyles.textInput}
          mode="outlined"
          label="Password"
          placeholder="Password"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(value: string) => this.validLoginForm(value, '')}
          secureTextEntry={this.state.showPassword}
          onSubmitEditing={() => {}}
          right={
            <TextInput.Icon
              name={() => (
                <Feather
                  name={
                    !this.state.showPassword
                      ? IconConstants.EYE
                      : IconConstants.EYE_OFF
                  }
                  color={ColorConstants.DARKGRAY}
                  size={IconConstants.ICON_SIZE_20}
                />
              )}
              onPress={() => {
                this.setState({showPassword: !this.state.showPassword});
              }}
            />
          }
        />
        <Block
          flex={false}
          margin={[heightPercentageToDP(2), widthPercentageToDP(8)]}>
          <Button
            onPress={() => {
              if (!this.state.emailValid && !this.state.passwordValid) {
                this.doLogin();
              }
            }}
            // disabled={!this.state.emailValid || !this.state.passwordValid}
            color={'secondary'}>
            {CommonUtils.translateMessageCode('signIn')}
          </Button>
          <Button
            onPress={() =>
              this.props.navigation.navigate(
                ComponentConstants.SIGNUP_SCREEN_NAME,
              )
            }
            color={'secondary'}>
            Sign Up
          </Button>
        </Block>
        <Text
          onPress={() =>
            this.props.navigation.navigate(
              ComponentConstants.FORGOT_PASSWORD_SCREEN_NAME,
            )
          }
          style={{textAlign: 'center', color: ColorConstants.BLUE}}>
          Forgot Password ?
        </Text>
      </KeyboardAwareScrollView>
    );
  }
}
