/**
 * @author <Vinayak.S>
 * @description Bottom Navigation
 * @copyright Supra software solutions, inc
 */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ColorConstants} from '../constants/colorConstants';
import {IconConstants} from '../constants/iconConstants';
import {BottomNavigationInput} from '../types/componentTypes';
import {
  DeliveryNavigator,
  HomeNavigator,
  InterpretationNavigator,
  PayoutNavigator,
  SettingNavigator,
  TransportationNavigator,
} from '../routes';
import {ComponentConstants} from '../constants/componentConstants';
import {Context, GlobalContextInput} from '../constants/contextConstants';
import BottomTab from '../common-components/bottom-tab';
import {Image} from 'react-native';
const Tab = createBottomTabNavigator();

export default class BottomNavigation extends React.Component<any> {
  static contextType = Context.GlobalContext;
  private bottomNavigationInput: BottomNavigationInput = {
    navigators: [
      {
        component: HomeNavigator,
        icon: {
          name: IconConstants.HOME,
          size: IconConstants.ICON_SIZE_20,
        },
        name: ComponentConstants.HOME_SCREEN_NAME,
        title: ComponentConstants.HOME_SCREEN_TITLE,
      },
      {
        component: TransportationNavigator,
        icon: {
          name: IconConstants.AMBULANCE,
          size: IconConstants.ICON_SIZE_20,
        },
        name: ComponentConstants.TRANSPORTATION_SCREEN_NAME,
        title: ComponentConstants.TRANSPORTATION_SCREEN_TITLE,
      },
      {
        component: DeliveryNavigator,
        icon: {
          name: IconConstants.SHIPPING_FAST,
          size: IconConstants.ICON_SIZE_20,
        },
        name: ComponentConstants.DELIVERY_SCREEN_NAME,
        title: ComponentConstants.DELIVERY_SCREEN_TITLE,
      },
      {
        component: InterpretationNavigator,
        icon: {
          name: IconConstants.LANGUAGE,
          size: IconConstants.ICON_SIZE_20,
        },
        name: ComponentConstants.INTERPRETATION_SCREEN_NAME,
        title: ComponentConstants.INTERPRETATION_SCREEN_TITLE,
      },
      {
        component: PayoutNavigator,
        icon: {
          name: IconConstants.CALCULATOR,
          size: IconConstants.ICON_SIZE_20,
        },
        name: ComponentConstants.PAYOUT_SCREEN_NAME,
        title: ComponentConstants.PAYOUT_SCREEN_TITLE,
      },

      {
        component: SettingNavigator,
        icon: {
          name: IconConstants.SETTING,
          size: IconConstants.ICON_SIZE_20,
        },
        name: ComponentConstants.SETTING_SCREEN_NAME,
        title: ComponentConstants.SETTING_SCREEN_TITLE,
      },
    ],
  };

  render() {
    return (
      <Tab.Navigator
        tabBar={(props) => <BottomTab {...props} />}
        initialRouteName={this.props.route.name}
        tabBarOptions={{
          activeTintColor: ColorConstants.GREEN,
          inactiveTintColor: ColorConstants.BLACK,
          inactiveBackgroundColor: ColorConstants.WHITE,
        }}>
        {this.getBottomNavigators()}
      </Tab.Navigator>
    );
  }

  private getBottomNavigators() {
    const navigators = [];
    const context = this.context as GlobalContextInput;

    if (
      this.bottomNavigationInput.navigators.length >= 6 &&
      context.sessionInfo &&
      (context.sessionInfo.scopes.includes('transporter') ||
        context.sessionInfo.scopes.includes('driver')) &&
      !context.sessionInfo.scopes.includes('interpreter')
    ) {
      this.bottomNavigationInput.navigators.splice(3, 1);
    }
    if (
      this.bottomNavigationInput.navigators.length >= 6 &&
      context.sessionInfo &&
      context.sessionInfo.scopes.includes('interpreter') &&
      !context.sessionInfo.scopes.includes('transporter')
    ) {
      this.bottomNavigationInput.navigators.splice(1, 2);
    }

    if (
      this.bottomNavigationInput.navigators.length >= 5 &&
      context.sessionInfo &&
      context.sessionInfo.scopes.includes('driver')
    ) {
      this.bottomNavigationInput.navigators.splice(3, 1);
    }
    for (
      let index = 0;
      index < this.bottomNavigationInput.navigators.length;
      index++
    ) {
      const element = this.bottomNavigationInput.navigators[index];
      navigators.push(
        <Tab.Screen
          options={{
            tabBarLabel: element.title,
            tabBarAccessibilityLabel: element.title,
            tabBarIcon: ({color}) => (
              <Image
                source={element.icon.name}
                style={{
                  tintColor: color,
                  height: element.icon.size,
                  width: element.icon.size,
                }}
              />
            ),
          }}
          name={element.name}
          component={element.component}
          key={element.name}
        />,
      );
    }
    return navigators;
  }
}
