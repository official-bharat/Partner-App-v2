import React from 'react';
import {SettingStyles} from '../../assets/styles/settingStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import {CommonStyles} from '../../assets/styles/commonStyles';
import {View, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {SettingState} from '../../types/types';
import {Context, GlobalContextInput} from '../../constants/contextConstants';
import {ObjectFactory} from '../../utils/objectFactory';
import {CommonUtils} from '../../utils/commonUtils';
import {IconConstants} from '../../constants/iconConstants';
import {ColorConstants} from '../../constants/colorConstants';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import {Buffer} from 'buffer';
import {ComponentConstants} from '../../constants/componentConstants';
import Text from '../../common-components/Text';
import Block from '../../common-components/Block';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {Avatar} from 'react-native-paper';
import Button from '../../common-components/Button';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../../utils/common-utils';
import {apiCall} from '../../utils/api-client';
var RNFS = require('react-native-fs');

/**
 * @author <Azhar.K>
 * @description Setting Screen
 * @copyright Supra software solutions, inc
 */

export default class SettingScreen extends React.Component<any, SettingState> {
  static contextType = Context.GlobalContext;

  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      loader: false,
    };
  }
  private getInterpreterProfile = async () => {
    const context = this.context as GlobalContextInput;
    const userService = ObjectFactory.getUserService(context);
    if (context.sessionInfo?.scopes.includes('transporter')) {
      const response = await userService.getTransporterProfile();
      if (response.success && response.data) {
        this.setState({transporterProfile: response.data});
      }
    } else if (context.sessionInfo?.scopes.includes('interpreter')) {
      const response = await userService.getInterpreterProfile();
      if (response.success && response.data) {
        this.setState({interpreterProfile: response.data});
      }
    }
  };
  private getDriverProfile = async () => {
    const context = this.context as GlobalContextInput;
    const userService = ObjectFactory.getUserService(context);
    if (context.sessionInfo?.scopes.includes('driver')) {
      const response = await userService.getDriverProfile();
      if (response.success && response.data) {
        this.setState({driverProfile: response.data.driverProfile});
      }
    }
  };

  private showCertificate = async () => {
    if (this.state.interpreterProfile) {
      const certificateId =
        this.state.interpreterProfile.languages[0].certificates[0]
          .certificateId;
      const userService = ObjectFactory.getUserService(this.context);
      const response = await userService.displayCertificate(certificateId);
      var b64 = Buffer.from(response).toString('base64');
      const path = `${RNFS.CachesDirectoryPath}/${certificateId}`;
      RNFetchBlob.fs.writeFile(path, b64, 'base64');
      FileViewer.open(`${RNFS.CachesDirectoryPath}/${certificateId}`).catch(
        (error) => {
          Alert.alert('Error', 'Error Opening File!', [
            {text: 'cancel', style: 'cancel', onPress: () => {}},
          ]);
        },
      );
    }
  };

  componentDidMount() {
    this.getDriverProfile();
    this.getInterpreterProfile();
  }

  commonView = (label: any, value: any) => {
    return (
      <Block
        flex={false}
        margin={[heightPercentageToDP(0.8), 0]}
        padding={[0, widthPercentageToDP(1)]}
        center={false}>
        <Text grey size={16}>
          {label}
        </Text>
        <Text style={styles.subtitle} size={16}>
          {strictValidString(value) ? value : 'N/A'}
        </Text>
      </Block>
    );
  };
  private getUserInitials = (fullname: string) => {
    return (
      fullname.substr(0, 1) +
      (fullname.split(' ').length >= 1
        ? fullname.split(' ')[1].substr(0, 1)
        : fullname.substr(1, 1))
    ).toUpperCase();
  };

  private deleteAccount = async () => {
    const context = this.context as GlobalContextInput;
    const userId = context.sessionInfo?.userId;
    this.setState({
      loader: true,
    });
    try {
      const res = await apiCall('PUT', `/v1/users/deactivate/${userId}`);
      if (res) {
        this.setState({
          loader: false,
        });
        CommonUtils.showMessageConfirmation(
          'Your account has been deactivated. Thank you for using MedTrans Go',
          () => {
            return CommonUtils.logout();
          },
        );
      }
    } catch (error) {
      this.setState({
        loader: true,
      });
      CommonUtils.showError(error.data);
    }
  };

  private confirmationDeleteAccount = () => {
    Alert.alert('Warning !', 'Do you want to deactivate your account ?', [
      {
        text: 'Yes',
        onPress: () => this.deleteAccount(),
      },
      {
        text: 'No',
        onPress: () => console.log('No Pressed'),
        style: 'cancel',
      },
    ]);
  };
  render() {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={{flex: 1}}>
          <View style={SettingStyles.iconContainer}>
            {this.state.interpreterProfile && (
              <Avatar.Text
                color={ColorConstants.WHITE}
                label={this.getUserInitials(
                  this.state.interpreterProfile.fullname,
                )}
                size={100}
              />
            )}
            {this.state.transporterProfile && (
              <Avatar.Text
                color={ColorConstants.WHITE}
                label={this.getUserInitials(
                  this.state.transporterProfile.fullname,
                )}
                size={100}
              />
            )}
            {this.state.driverProfile && (
              <Avatar.Text
                color={ColorConstants.WHITE}
                label={this.getUserInitials(this.state.driverProfile.fullname)}
                size={100}
              />
            )}
          </View>

          {this.state.interpreterProfile && (
            <Text medium size={16} uppercase center>
              {this.state.interpreterProfile.fullname}
            </Text>
          )}
          {this.state.driverProfile && (
            <Text medium size={16} uppercase center>
              {this.state.driverProfile.fullname}
            </Text>
          )}
          {this.state.transporterProfile && (
            <Text medium size={16} uppercase center>
              {this.state.transporterProfile.fullname}
            </Text>
          )}
          {this.state.interpreterProfile ? (
            <View style={styles.labelContainer}>
              {this.commonView(
                CommonUtils.translateMessageCode('address'),
                strictValidObjectWithKeys(
                  this.state.interpreterProfile.address,
                ) && this.state.interpreterProfile.address.fullAddress,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('email'),
                this.state.interpreterProfile.email,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('language'),
                this.state.interpreterProfile.languages[0].languageName,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('phone'),
                this.state.interpreterProfile.phone,
              )}
              <Block flex={false} row space="around">
                <Button
                  style={{width: widthPercentageToDP(42), alignSelf: 'center'}}
                  onPress={() =>
                    this.props.navigation.navigate({
                      name: ComponentConstants.CHANGE_PASSWORD_SCREEN_NAME,
                    })
                  }
                  color="secondary">
                  {CommonUtils.translateMessageCode('changePasswordText')}
                </Button>
                <Button
                  style={{width: widthPercentageToDP(42), alignSelf: 'center'}}
                  onPress={() => this.showCertificate()}
                  color="secondary">
                  {CommonUtils.translateMessageCode('viewCertificate')}
                </Button>
              </Block>
            </View>
          ) : null}

          {this.state.transporterProfile ? (
            <View style={styles.labelContainer}>
              {this.commonView(
                CommonUtils.translateMessageCode('address'),
                strictValidObjectWithKeys(
                  this.state.transporterProfile.address,
                ) && this.state.transporterProfile.address.fullAddress,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('email'),
                this.state.transporterProfile.email,
              )}
              {this.commonView(
                'Company Name',
                this.state.transporterProfile.companyName,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('phone'),
                this.state.transporterProfile.phone,
              )}
            </View>
          ) : null}
          {this.state.driverProfile ? (
            <View style={styles.labelContainer}>
              {this.commonView(
                CommonUtils.translateMessageCode('address'),
                this.state.driverProfile.address.fullAddress,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('email'),
                this.state.driverProfile.email,
              )}
              {this.commonView(
                'License Number',
                this.state.driverProfile.licenceNo,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('phone'),
                this.state.driverProfile.phone,
              )}
            </View>
          ) : null}
        </ScrollView>
        <Block padding={[0, widthPercentageToDP(3)]} flex={false}>
          <Button
            isLoading={this.state.loader}
            onPress={() => this.confirmationDeleteAccount()}
            color="accent">
            Deactivate Account
          </Button>
        </Block>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  labelBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    lineHeight: 25,
    width: widthPercentageToDP(90),
  },
  label: {
    lineHeight: 25,
    color: ColorConstants.DARKGRAY,
  },
  labelContainer: {
    paddingHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
