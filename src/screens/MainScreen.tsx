import React from 'react';
import {Alert} from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import DrawerNavigation from '../components/DrawerNavigation';
import {ComponentConstants} from '../constants/componentConstants';
import {Context, GlobalContextInput} from '../constants/contextConstants';
import {IconConstants} from '../constants/iconConstants';
import {DrawerInput} from '../types/componentTypes';
import {CommonUtils} from '../utils/commonUtils';
import {ObjectFactory} from '../utils/objectFactory';
import {CMRNavigator} from '../routes';
import {images} from '../assets';
const PackageJson = require('../../package.json');

export default class MainScreen extends React.Component<any> {
  static contextType = Context.GlobalContext;
  private drawerInput: DrawerInput = {
    userInfo: {
      fullname: '',
    },
    logoutHandler: this.logout,
    navigators: [
      {
        name: ComponentConstants.HOME_SCREEN_NAME,
        component: BottomNavigation,
        icon: images.home_icon,
        title: ComponentConstants.HOME_SCREEN_TITLE,
      },
      {
        name: ComponentConstants.INTERPRETATION_SCREEN_NAME,
        component: BottomNavigation,
        icon: images.language_icon,
        title: ComponentConstants.INTERPRETATION_SCREEN_TITLE,
      },
      {
        name: ComponentConstants.TRANSPORTATION_SCREEN_NAME,
        component: BottomNavigation,
        icon: images.transport_icon,
        title: ComponentConstants.TRANSPORTATION_SCREEN_TITLE,
      },
      {
        name: ComponentConstants.DELIVERY_SCREEN_NAME,
        component: BottomNavigation,
        icon: images.delivery_icon,
        title: ComponentConstants.DELIVERY_SCREEN_TITLE,
      },
      {
        name: ComponentConstants.PAYOUT_SCREEN_NAME,
        component: BottomNavigation,
        icon: images.payout_icon,
        title: ComponentConstants.PAYOUT_SCREEN_TITLE,
      },

      {
        name: ComponentConstants.CMR_SCREEN_NAME,
        icon: images.book_icon,
        component: CMRNavigator,
        title: ComponentConstants.CMR_SCREEN_TITLE,
      },
      {
        name: ComponentConstants.SETTING_SCREEN_NAME,
        component: BottomNavigation,
        icon: images.profile_icon,
        title: ComponentConstants.SETTING_SCREEN_TITLE,
      },
    ],
    version: PackageJson.version,
  };

  private logout() {
    Alert.alert('', 'Are you sure that you want to logout?', [
      {text: 'No', onPress: () => null, style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          CommonUtils.logout();
        },
        style: 'default',
      },
    ]);
  }
  constructor(props: Readonly<any>) {
    super(props);
  }
  componentDidMount() {
    ObjectFactory.setContext(this.context);
  }
  render() {
    const context = this.context as GlobalContextInput;
    if (context.sessionInfo) {
      this.drawerInput.userInfo.fullname = context.sessionInfo.fullname;
    }
    if (
      this.drawerInput.navigators.length >= 6 &&
      context.sessionInfo &&
      (context.sessionInfo.scopes.includes('transporter') ||
        context.sessionInfo.scopes.includes('driver')) &&
      !context.sessionInfo.scopes.includes('interpreter')
    ) {
      this.drawerInput.navigators.splice(1, 1);
    }
    if (
      this.drawerInput.navigators.length >= 6 &&
      context.sessionInfo &&
      context.sessionInfo.scopes.includes('interpreter') &&
      !context.sessionInfo.scopes.includes('transporter')
    ) {
      this.drawerInput.navigators.splice(2, 2);
    }
    if (context.sessionInfo && context.sessionInfo.scopes.includes('driver')) {
      this.drawerInput.navigators.splice(3, 1);
    }
    return <DrawerNavigation {...this.drawerInput} />;
  }
}
