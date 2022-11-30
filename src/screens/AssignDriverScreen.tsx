import React from 'react';
import {View, BackHandler, LogBox, Alert} from 'react-native';
import {CommonStyles} from '../assets/styles/commonStyles';
import {AssignDriverState, DriverList} from '../types/types';
import {CommonUtils} from '../utils/commonUtils';
import {ObjectFactory} from '../utils/objectFactory';
import {ComponentConstants} from '../constants/componentConstants';
import {Context} from '../constants/contextConstants';
import Dropdown from '../components/Dropdown';
import {AssignDriversStyles} from '../assets/styles/assignDriverStyles';
import {URLConstants} from '../constants/urlConstants';
import {ApiRequest} from '../services/util/iHttpService';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Header from '../common-components/header';
import Button from '../common-components/Button';
const AppConstant = require('../../app.json');

export default class AssignDriverScreen extends React.Component<
  any,
  AssignDriverState
> {
  static contextType = Context.GlobalContext;
  private driverList: DriverList[] = [];
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      serviceRequest: this.props.route.params.serviceRequest,
      routeId: this.props.route.params.routeId,
      drivers: [],
      driverId: '',
      disableSubmit: true,
    };
    this.getDriverList(0);
  }

  private getDriverList = async (start?: number) => {
    const response = await ObjectFactory.getUserService(
      this.context,
    ).getDriverList(start);
    if (response.data && response.success) {
      response.data.forEach((driver) => {
        this.driverList.push({label: driver.fullname, value: driver.id});
      });
      this.setState({drivers: this.driverList});
    }
  };

  private assignDriver = async () => {
    if (this.state.routeId && this.state.driverId) {
      const request: ApiRequest = {
        baseURL: AppConstant.serverUrl,
        data: {
          requestId: this.state.serviceRequest?.id,
        },
        url: `${URLConstants.HTTP_URL_ROUTES}/${this.state.routeId}/${this.state.driverId}/assign`,
        loaderEvent: {
          show: true,
        },
      };
      const response = await ObjectFactory.getHttpService().put<string>(
        request,
      );
      if (response.success) {
        const response = Alert.alert(
          'Awesome!',
          'Driver assigned successfully',
        );
        if (
          this.state.serviceRequest &&
          this.state.serviceRequest.transportRequest
        ) {
          this.props.navigation.navigate(
            ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME,
            {requestService: this.state.serviceRequest},
          );
        }
        if (
          this.state.serviceRequest &&
          this.state.serviceRequest.deliveryRequest
        ) {
          this.props.navigation.navigate(
            ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME,
            {requestService: this.state.serviceRequest},
          );
        }
      }
    }
  };

  componentDidMount() {
    LogBox.ignoreAllLogs();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    if (
      this.state.serviceRequest &&
      this.state.serviceRequest.deliveryRequest
    ) {
      this.props.navigation.navigate(
        ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME,
        {requestService: this.state.serviceRequest},
      );
      return true;
    }
    if (
      this.state.serviceRequest &&
      this.state.serviceRequest.transportRequest
    ) {
      this.props.navigation.navigate(
        ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME,
        {requestService: this.state.serviceRequest},
      );
      return true;
    }
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header
          centerText={
            this.props.route.params.title
              ? this.props.route.params.title
              : CommonUtils.translateMessageCode('assignDriver')
          }
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: heightPercentageToDP(2),
          }}>
          <View style={AssignDriversStyles.container}>
            {this.state.drivers ? (
              <Dropdown
                defaultValue={this.state.driverId || ''}
                items={this.state.drivers}
                placeholder="Select Driver"
                onSelect={(item: any, value: any) => {
                  this.setState({driverId: item});
                }}
              />
            ) : null}
          </View>
          <Button
            disabled={!this.state.driverId}
            onPress={() => this.assignDriver()}
            style={{width: widthPercentageToDP(40)}}
            color="secondary">
            {CommonUtils.translateMessageCode('submit')}
          </Button>
        </View>
      </View>
    );
  }
}
