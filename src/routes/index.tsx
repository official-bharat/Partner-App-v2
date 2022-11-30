import React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {
  ComponentConstants,
  VERIFY_OTP_SCREEN_NAME,
} from '../constants/componentConstants';
import {ColorConstants} from '../constants/colorConstants';
import {IconConstants} from '../constants/iconConstants';
import {CommonUtils} from '../utils/commonUtils';
import {Image, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from '../screens/splash';
import LoginScreen from '../screens/auth';
import HomeScreen from '../screens/home';
import SettingScreen from '../screens/profile';
import InterpretationScreen from '../screens/InterpretationScreen';
import ChangePasswordScreen from '../screens/profile/change-password';
import InterpretationRequestScreen from '../screens/InterpretationRequestScreen';
import CompleteRequestScreen from '../screens/CompleteRequestScreen';
import PayoutScreen from '../screens/payout';
import PayoutDetailsScreen from '../screens/payout/details';
import TransportationScreen from '../screens/transportation';
import TransportRequestScreen from '../screens/transportation/details';
import AssignDriverScreen from '../screens/AssignDriverScreen';
import AcceptRequestScreen from '../screens/common/AcceptRequestScreen';
import GoogleMap from '../components/GoogleMap.ios';
import GoogleMapAndroid from '../components/GoogleMap.android';
import CompleteRouteScreen from '../screens/CompleteRouteScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import DeliveryRequestScreen from '../screens/DeliveryRequestScreen';
import CompleteDeliveryRequestScreen from '../screens/CompleteDeliveryRequestScreen';
import NewPasswordScreen from '../screens/profile/new-password';
import RouteDetailsScreen from '../screens/RouteDetailScreen';
import DeliveryDetailsScreen from '../screens/DeliveryDetailScreen';
import CMRScreen from '../screens/cmr';
import CMRDetailsScreen from '../screens/cmr/details';
import CompleteCMRScreen from '../screens/cmr/complete';
import SignUp from '../screens/auth/signup';
import PersonalInformation from '../screens/auth/signup/personal-info';
import Questionnaire from '../screens/auth/signup/questionaire';
import Certificates from '../screens/auth/signup/certificates';
import LanguageCertificates from '../screens/auth/signup/language';
import ForgotPassword from '../screens/auth/forgot-password';
import VerifyOTP from '../screens/auth/forgot-password/verify-otp';
import CompleteTrip from '../screens/complete-trip';

const Stack = createStackNavigator();

const stackNavigationOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: ColorConstants.WHITE,
  },
  headerTintColor: ColorConstants.WHITE,
  headerBackTitle: CommonUtils.translateMessageCode('back'),
};

export class LoginNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name={ComponentConstants.SPLASH_SCREEN_NAME}
          component={SplashScreen}
        />
        <Stack.Screen
          name={ComponentConstants.LOGIN_SCREEN_NAME}
          component={LoginScreen}
        />
        <Stack.Screen
          name={ComponentConstants.SIGNUP_SCREEN_NAME}
          component={SignUp}
        />
        <Stack.Screen
          name={ComponentConstants.PERSONAL_INFORMATION_SCREEN_NAME}
          component={PersonalInformation}
        />
        <Stack.Screen
          name={ComponentConstants.QUESTIONNAIRE_SCREEN_NAME}
          component={Questionnaire}
        />
        <Stack.Screen
          name={ComponentConstants.CERTIFICATE_SCREEN_NAME}
          component={Certificates}
        />
        <Stack.Screen
          name={ComponentConstants.LANGUAGE_CERTIFICATE_SCREEN_NAME}
          component={LanguageCertificates}
        />
        <Stack.Screen
          name={ComponentConstants.FORGOT_PASSWORD_SCREEN_NAME}
          component={ForgotPassword}
        />
        <Stack.Screen
          name={ComponentConstants.VERIFY_OTP_SCREEN_NAME}
          component={VerifyOTP}
        />
        <Stack.Screen
          name={ComponentConstants.NEW_PASSWORD_SCREEN_NAME}
          component={NewPasswordScreen}
          options={{title: 'Reset Password'}}
        />
      </Stack.Navigator>
    );
  }
}

export class HomeNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.HOME_SCREEN_NAME}
          component={HomeScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
      </Stack.Navigator>
    );
  }
}

export class SettingNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.SETTING_SCREEN_NAME}
          component={SettingScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name={ComponentConstants.CHANGE_PASSWORD_SCREEN_NAME}
          component={ChangePasswordScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
}

export class CMRNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.CMR_SCREEN_NAME}
          component={CMRScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name={ComponentConstants.CMR_DETAILS_SCREEN_NAME}
          component={CMRDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.CMR_COMPLETE_SCREEN_NAME}
          component={CompleteCMRScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
}
export class InterpretationNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.INTERPRETATION_SCREEN_NAME}
          component={InterpretationScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name={ComponentConstants.INTERPRETATION_REQUEST_SCREEN_NAME}
          component={InterpretationRequestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.COMPLETE_REQUEST_SCREEN_NAME}
          component={CompleteRequestScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
}

export class TransportationNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator
        initialRouteName={ComponentConstants.TRANSPORTATION_SCREEN_NAME}
        screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.TRANSPORTATION_SCREEN_NAME}
          component={TransportationScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name={ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME}
          component={TransportRequestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.ROUTE_DETAIL_SCREEN_NAME}
          component={RouteDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.ACCEPT_REQUEST_SCREEN_NAME}
          component={AcceptRequestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.GOOGLE_MAP_SCREEN_NAME}
          component={GoogleMap}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.COMPLETE_TRIP_SCREEN_NAME}
          component={CompleteTrip}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.GOOGLE_MAP_Android_SCREEN_NAME}
          component={GoogleMapAndroid}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME}
          component={AssignDriverScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.COMPLETE_ROUTE_SCREEN_NAME}
          component={CompleteRouteScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.COMPLETE_DELIVERY_REQUEST_SCREEN_NAME}
          component={CompleteDeliveryRequestScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
}

export class PayoutNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.PAYOUT_SCREEN_NAME}
          component={PayoutScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name={ComponentConstants.PAYOUT_DETAILS_SCREEN_NAME}
          component={PayoutDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
}

export class DeliveryNavigator extends React.Component<any> {
  render() {
    return (
      <Stack.Navigator screenOptions={stackNavigationOptions}>
        <Stack.Screen
          name={ComponentConstants.DELIVERY_SCREEN_NAME}
          component={DeliveryScreen}
          options={{
            headerBackground: props => <HeaderImage />,
            headerLeft: () => <MenuToggleIcon {...this.props} />,
            title: '',
            headerStyle: {backgroundColor: '#fff'},
          }}
        />
        <Stack.Screen
          name={ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME}
          component={DeliveryRequestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.DELIVERY_DETAIL_SCREEN_NAME}
          component={DeliveryDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.GOOGLE_MAP_SCREEN_NAME}
          component={GoogleMap}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.GOOGLE_MAP_Android_SCREEN_NAME}
          component={GoogleMapAndroid}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME}
          component={AssignDriverScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.COMPLETE_DELIVERY_REQUEST_SCREEN_NAME}
          component={CompleteDeliveryRequestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.ACCEPT_REQUEST_SCREEN_NAME}
          component={AcceptRequestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ComponentConstants.COMPLETE_TRIP_SCREEN_NAME}
          component={CompleteTrip}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  }
}

class MenuToggleIcon extends React.Component<any> {
  render() {
    return (
      <Icon.Button
        name={IconConstants.IOS_MENU}
        size={IconConstants.ICON_SIZE_35}
        backgroundColor={ColorConstants.WHITE}
        onPress={() => this.props.navigation.openDrawer()}
        color={ColorConstants.GREEN}
      />
    );
  }
}

class HeaderImage extends React.Component<any> {
  render() {
    return (
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <Image
          style={{
            width: 110,
            height: 35,
            marginHorizontal: '35%',
            marginVertical: 6,
          }}
          source={require('../assets/images/header-logo.png')}
        />
      </View>
    );
  }
}
