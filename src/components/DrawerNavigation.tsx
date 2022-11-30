import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Avatar, Title} from 'react-native-paper';
import {Image, StyleSheet, View} from 'react-native';
import {DrawerInput} from '../types/componentTypes';
import {ColorConstants} from '../constants/colorConstants';
import {CommonUtils} from '../utils/commonUtils';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Block from '../common-components/Block';
import {images} from '../assets';
const DrawerNavigator = createDrawerNavigator();

export default class Drawer extends React.Component<DrawerInput> {
  private drawerStyle: DrawerContentOptions = {
    activeTintColor: ColorConstants.DRAWER_SELECTED_MENU,
    itemStyle: {marginVertical: 8},
  };

  renderHeight = (type: any) => {
    switch (type) {
      case 'home':
        return 25;
      case 'transportation':
        return 22;
      case 'delivery':
        return 25;
      case 'interpretation':
        return 25;
      case 'payout':
        return 25;
      case 'settings':
        return 25;
      case 'CMR':
        return 25;
      default:
        return 30;
    }
  };
  renderWidth = (type: any) => {
    switch (type) {
      case 'home':
        return 25;
      case 'transportation':
        return 32;
      case 'delivery':
        return 25;
      case 'interpretation':
        return 25;
      case 'payout':
        return 25;
      case 'settings':
        return 25;
      case 'CMR':
        return 25;
      default:
        return 30;
    }
  };

  private getDrawerNavigators() {
    const navigators = [];
    for (let index = 0; index < this.props.navigators.length; index++) {
      const element = this.props.navigators[index];
      navigators.push(
        <DrawerNavigator.Screen
          key={'Index' + index}
          name={element.name}
          component={element.component}
          options={{
            title: element.title,
            drawerIcon: ({focused, size}) => (
              <Block flex={false} style={{width: widthPercentageToDP(8)}}>
                <Image
                  source={element.icon}
                  style={{
                    tintColor: ColorConstants.GREEN,
                    height: this.renderHeight(element.name),
                    width: this.renderWidth(element.name),
                  }}
                />
              </Block>
            ),
          }}
        />,
      );
    }
    return navigators;
  }

  render() {
    return (
      <DrawerNavigator.Navigator
        drawerType={'slide'}
        drawerContentOptions={this.drawerStyle}
        drawerContent={(props) => (
          <CustomDrawerContent {...this.props} {...props} />
        )}>
        {this.getDrawerNavigators()}
      </DrawerNavigator.Navigator>
    );
  }
}

class CustomDrawerContent extends React.Component<DrawerInput> {
  private styles = StyleSheet.create({
    userInfoSection: {
      paddingLeft: 20,
      paddingBottom: 10,
      borderBottomWidth: 3,
      borderBottomColor: '#f2f3f7',
    },
    title: {
      fontSize: 16,
      marginTop: 10,
      marginBottom: 5,
      fontWeight: 'bold',
    },
  });

  private getUserInitials = (fullname: string) => {
    return (
      fullname.substr(0, 1) +
      (fullname.split(' ').length >= 1
        ? fullname.split(' ')[1].substr(0, 1)
        : fullname.substr(1, 1))
    ).toUpperCase();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <DrawerContentScrollView {...this.props}>
          <View style={this.styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Text
                color={ColorConstants.WHITE}
                label={this.getUserInitials(this.props.userInfo.fullname)}
                size={50}
              />
              <View style={{marginLeft: 20}}>
                <Title style={this.styles.title}>
                  {this.props.userInfo.fullname}
                </Title>
              </View>
            </View>
          </View>
          <DrawerItemList {...(this.props as any)} />
          <DrawerItem
            label={CommonUtils.translateMessageCode('logout')}
            onPress={this.props.logoutHandler}
            icon={() => (
              <Block flex={false} style={{width: widthPercentageToDP(8)}}>
                <Image
                  source={images.logout_icon}
                  style={{
                    tintColor: ColorConstants.GREEN,
                    height: 25,
                    width: 25,
                  }}
                />
              </Block>
            )}
          />
        </DrawerContentScrollView>
        <DrawerItem
          style={{bottom: -0, position: 'relative'}}
          label={'Version ' + this.props.version}
          onPress={() => {}}
        />
      </View>
    );
  }
}
