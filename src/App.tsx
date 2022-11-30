/**
 * @author <Aniket.P>
 * @description App staring point
 * @copyright Supra software solutions, inc
 */

import React from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {DefaultTheme, Provider} from 'react-native-paper';
import {AppInput} from './types/componentTypes';
import {LoginNavigator} from './routes/index';
import {AppState} from './types/types';
import {ColorConstants} from './constants/colorConstants';
import {GlobalContextInput, Context} from './constants/contextConstants';
import {CommonStyles} from './assets/styles/commonStyles';
import MainScreen from './screens/MainScreen';
import {ObjectFactory} from './utils/objectFactory';
import {DateUtils} from './utils/dateUtils';
import {CommonConstants} from './constants/commonConstants';
import {getUniqueId} from 'react-native-device-info';
import LoadingView from './common-components/LoadingView';
import Block from './common-components/Block';
import Text from './common-components/Text';
import codePush from 'react-native-code-push';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {light} from './common-components/theme/colors';
import {ComponentConstants} from './constants/componentConstants';
let codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

class App extends React.Component<AppInput, AppState> {
  private globalContextProvider: GlobalContextInput = {
    showLoader: (value: boolean) => {
      this.setState({showLoader: value});
    },
    checkUserIsLoggedIn: () => {
      this.checkIfUserIsLoggedIn();
    },
  };
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      isUserLoggedIn: false,
      showLoader: false,
      progress: false,
    };
    this.checkIfUserIsLoggedIn();
  }

  codePushStatusDidChange = (syncStatus: any) => {
    console.log('syncStatus: ', syncStatus);
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Checking for update.');
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('Download packaging....');
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        console.log('Awaiting user action....');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('Installing update');
        this.setState({
          progress: false,
        });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('codepush status up to date');
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        console.log('update cancel by user');
        this.setState({
          progress: false,
        });
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log('Update installed and will be applied on restart.');
        this.setState({
          progress: false,
        });
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        console.log('An unknown error occurred');
        this.setState({
          progress: false,
        });
        break;
    }
  };

  codePushDownloadDidProgress = (pro: any) => {
    console.log('pro: ', pro);
    // setProgress(pro);
    this.setState({
      progress: pro,
    });
  };
  componentDidMount() {
    // codePush.sync(
    //   {
    //     updateDialog: true,
    //     installMode: codePush.InstallMode.IMMEDIATE,
    //   },
    //   (status) => this.codePushStatusDidChange(status),
    //   ({receivedBytes, totalBytes}) =>
    //     this.codePushDownloadDidProgress({receivedBytes, totalBytes}),
    // );
  }

  showProgressView = () => {
    const {progress} = this.state;
    return (
      <Modal visible={true} transparent>
        <Block center middle color={'rgba(0,0,0,0.8)'}>
          <Block
            center
            flex={false}
            borderRadius={8}
            padding={[hp(2), wp(10)]}
            color="#fff">
            <Text margin={[hp(0.5), 0, 0]} capitalize>
              In Progress....
            </Text>

            <Block flex={false} center>
              <Text margin={[8, 0, 0]}>{`${(
                Number(progress?.receivedBytes) / 1048576
              ).toFixed(2)}MB/${(
                Number(progress?.totalBytes) / 1048576
              ).toFixed(2)}`}</Text>
              <Block flex={false} center margin={[hp(1), 0]}>
                <ActivityIndicator color={light.secondary} />
              </Block>
              <Text>
                {(
                  (Number(progress?.receivedBytes) /
                    Number(progress?.totalBytes)) *
                  100
                ).toFixed(0)}
                %
              </Text>
            </Block>
          </Block>
        </Block>
      </Modal>
    );
  };

  private async checkIfUserIsLoggedIn() {
    await ObjectFactory.getCacheService().saveValue(
      CommonConstants.DEVICE_ID_FIELD_NAME,
      getUniqueId(),
    );
    const sessionInfo = await ObjectFactory.getCacheService().getSessionInfo();
    let isUserLoggedIn = false;
    if (
      sessionInfo &&
      sessionInfo.expireTime > DateUtils.getCurrentTimeInMillis()
    ) {
      if (sessionInfo.status === 'SETUP_PENDING') {
        isUserLoggedIn = false;
      } else {
        isUserLoggedIn = true;
        this.globalContextProvider.sessionInfo = sessionInfo;
      }
    }
    this.setState({isUserLoggedIn});
  }

  render() {
    const theme = {
      ...DefaultTheme,
      roundness: 2,
      colors: {
        ...DefaultTheme.colors,
        primary: ColorConstants.GREEN,
        accent: ColorConstants.DARKGRAY,
      },
    };
    return (
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          backgroundColor={ColorConstants.STATUS_BAR}
          barStyle="default"
        />
        {this.state.progress ? this.showProgressView() : null}
        <Context.GlobalContext.Provider value={this.globalContextProvider}>
          <NavigationContainer>
            <Provider theme={theme}>
              {this.state.showLoader ? <LoadingView /> : null}
              {this.state.isUserLoggedIn ? <MainScreen /> : <LoginNavigator />}
            </Provider>
          </NavigationContainer>
        </Context.GlobalContext.Provider>
      </SafeAreaView>
    );
  }
}
export default codePush(App);
