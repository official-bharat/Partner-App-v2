import React from 'react';
import {View, Text, ImageBackground} from 'react-native';
import {HomeStyles} from '../../assets/styles/homeStyles';
import {CommonStyles} from '../../assets/styles/commonStyles';
import {CommonUtils} from '../../utils/commonUtils';
import {HomeState} from '../../types/types';
import {Context, GlobalContextInput} from '../../constants/contextConstants';
import {getCurrentLocation, locationPermission} from '../../utils/helper';
import AsyncStorage from '@react-native-community/async-storage';
import {saveAsync} from '../../utils/local-storage';
/**
 * @author <Azhar.K>
 * @description Home Screen
 * @copyright Supra software solutions, inc
 */

export default class HomeScreen extends React.Component<any, HomeState> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      fullname: '',
    };
  }
  componentDidMount() {
    const context = this.context as GlobalContextInput;
    if (context.sessionInfo) {
      this.setState({fullname: context.sessionInfo.fullname});
    }
    this.getLiveLocation();
  }

  getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const {latitude, longitude} = await getCurrentLocation();
      const data = {latitude, longitude};
      saveAsync('location', data);
    }
  };
  render() {
    return (
      <View style={CommonStyles.container}>
        <View style={HomeStyles.welcomeText}>
          <Text>Welcome {this.state.fullname}!</Text>
        </View>

        <View style={HomeStyles.header}>
          <ImageBackground
            source={require('../../assets/images/welcome.png')}
            style={HomeStyles.headerImage}
          />
        </View>

        <View>
          <Text style={HomeStyles.headerImageText}>
            {CommonUtils.translateMessageCode('welcomeText')}
          </Text>
        </View>
      </View>
    );
  }
}
