/**
 * @author <Vinayak.S>
 * @description Splash Screen
 * @copyright Supra software solutions, inc
 */

import React from 'react';
import {View, Image} from 'react-native';
import {
  CommonStyles,
  footerImage,
  logo,
} from '../../assets/styles/commonStyles';
import {ComponentConstants} from '../../constants/componentConstants';
import {strictValidObjectWithKeys} from '../../utils/common-utils';
import {getAsync} from '../../utils/local-storage';

export default class SplashScreen extends React.Component<any> {
  constructor(props: Readonly<any>) {
    super(props);
  }

  navigate = async () => {
    const bioauthRes = await getAsync('bioauth');
    setTimeout(() => {
      this.props.navigation.navigate(ComponentConstants.LOGIN_SCREEN_NAME, {
        bio: strictValidObjectWithKeys(bioauthRes) ? true : false,
      });
    }, 2000);
  };

  componentDidMount() {
    this.navigate();
  }

  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={CommonStyles.header}>
          <Image style={CommonStyles.logo} source={logo} resizeMode="stretch" />
        </View>
        <Image
          style={CommonStyles.footerImage}
          source={footerImage}
          resizeMode="stretch"
        />
      </View>
    );
  }
}
