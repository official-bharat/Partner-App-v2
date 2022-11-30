import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {Appbar, Divider, List, Menu} from 'react-native-paper';
import {CMRState} from '../../types/types';
import {InterpretationStyles} from '../../assets/styles/interpretationStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ObjectFactory} from '../../utils/objectFactory';
import {CommonUtils} from '../../utils/commonUtils';
import {Context} from '../../constants/contextConstants';
import {IconConstants} from '../../constants/iconConstants';
import {ColorConstants} from '../../constants/colorConstants';
import {RequestStatus, ServiceRequest} from '../../types/entity';
import {CommonStyles, HeaderTheme} from '../../assets/styles/commonStyles';
import {DateUtils} from '../../utils/dateUtils';
import {ComponentConstants} from '../../constants/componentConstants';
import {Condition} from '../../types/requests';
import EmptyFile from '../../common-components/emptyFile';

export default class CMRScreen extends React.Component<any, CMRState> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      status:
        this.props.route.params && this.props.route.params.status
          ? this.props.route.params.status
          : 'Pending',
      serviceRequests: [],
      totalCount: 0,
      openMenu: false,
      loader: false,
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.setState({serviceRequests: []});
      await this.setState({
        status:
          this.props.route.params && this.props.route.params.status
            ? this.props.route.params.status
            : this.context.sessionInfo.scopes.includes('driver')
            ? 'Confirmed'
            : 'Pending',
      });
      await this.getServiceRequests(0);
    });
    this.getServiceRequests(0);
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(ComponentConstants.HOME_SCREEN_NAME);
    return true;
  };

  private getServiceRequests = async (
    start?: number,
    status?: RequestStatus,
  ) => {
    this.setState({openMenu: false});
    if (status) {
      this.setState({status: status});
    }
    let conditions: Condition[] = [];
    const selectedStatus = status ? status : this.state.status;
    if (selectedStatus && selectedStatus === 'Pending') {
      conditions.push({
        fieldName: 'appointment.timestamp',
        op: 'gt',
        value: DateUtils.getCurrentTimeInMillis() - DateUtils.convertMinutesToMillis(24 * 60),
      });
    }
    this.setState({
      loader: true,
    });
    const requestService = ObjectFactory.getRequestService(this.context);
    const response = await requestService.getServiceRequests({
      conditions,
      service: 'cmrRequest',
      status: status ? status : this.state.status,
      start,
    });
    if (response.success && response.data) {
      this.setState({serviceRequests: response.data});
      this.setState({
        loader: false,
      });
      if (response.totalCount) {
        this.setState({totalCount: response.totalCount});
        this.setState({
          loader: false,
        });
      }
    } else {
      this.setState({serviceRequests: []});
      CommonUtils.showError(response);
      this.setState({
        loader: false,
      });
    }
  };
  private getListItem = (serviceRequest: ServiceRequest) => {
    return (
      <TouchableOpacity
        style={{borderBottomWidth: 1, borderBottomColor: ColorConstants.GRAY}}
        onPress={() => {
          // Go to request details
          this.props.navigation.navigate(
            ComponentConstants.CMR_DETAILS_SCREEN_NAME,
            {requestService: serviceRequest},
          );
        }}>
        <List.Item
          title={serviceRequest.appointment.patient.fullName}
          description={({ellipsizeMode, color: descriptionColor, fontSize}) => (
            <View>
              <Text
                numberOfLines={2}
                ellipsizeMode={ellipsizeMode}
                style={{color: descriptionColor, fontSize, marginLeft: 0}}>
                {serviceRequest.cmrRequest?.healthInsuranceName + ' '}
                {DateUtils.formatDate(
                  serviceRequest.appointment.timestamp,
                  DateUtils.FORMAT_DATETIME_MONTH,
                )}
              </Text>
            </View>
          )}
          left={(props) => <CMRIcon status={this.state.status} />}
        />
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={CommonStyles.container}>
        <Appbar.Header theme={HeaderTheme}>
          <Appbar.Content
            title={CommonUtils.translateMessageCode('CRM')}
            style={InterpretationStyles.appbarContent}
          />
          <TouchableOpacity
            style={InterpretationStyles.menuView}
            onPress={() => this.setState({openMenu: true})}>
            <Text style={InterpretationStyles.menuText}>
              {this.state.status}
            </Text>
            <Menu
              onDismiss={() => this.setState({openMenu: false})}
              visible={this.state.openMenu}
              anchor={
                <Appbar.Action
                  style={InterpretationStyles.menuAction}
                  color={ColorConstants.GREEN}
                  icon={IconConstants.MENU_DOWN}
                  onPress={() => this.setState({openMenu: true})}
                  size={IconConstants.ICON_SIZE_30}
                />
              }>
              {!this.context.sessionInfo.scopes.includes('driver') && (
                <Menu.Item
                  title={CommonUtils.translateMessageCode('pending')}
                  onPress={() => {
                    this.getServiceRequests(0, 'Pending');
                  }}
                />
              )}
              <Divider />
              <Menu.Item
                title={CommonUtils.translateMessageCode('scheduled')}
                onPress={() => {
                  this.getServiceRequests(0, 'Confirmed');
                }}
              />
              <Divider />
              <Menu.Item
                title={CommonUtils.translateMessageCode('completed')}
                onPress={() => {
                  this.getServiceRequests(0, 'Completed');
                }}
              />
            </Menu>
          </TouchableOpacity>
        </Appbar.Header>
        <FlatList
          data={this.state.serviceRequests}
          renderItem={({item}) => this.getListItem(item)}
          keyExtractor={(item) => item.requestId}
          ListEmptyComponent={<EmptyFile text="No Request found" />}
          contentContainerStyle={{flexGrow: 1}}
        />
      </View>
    );
  }
}
class CMRIcon extends React.Component<any, {status: string}> {
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      status: this.props.status,
    };
  }
  render() {
    return (
      <View
        style={[
          InterpretationStyles.circleLeft,
          {
            borderColor:
              this.state.status === 'Pending'
                ? ColorConstants.YELLOW
                : this.state.status === 'Confirmed'
                ? ColorConstants.LIGHT_BLUE
                : ColorConstants.GREEN,
          },
        ]}>
        <Icon
          style={InterpretationStyles.iconLeft}
          name={IconConstants.CMR}
          color={ColorConstants.WHITE}
          size={IconConstants.ICON_SIZE_20}
        />
      </View>
    );
  }
}
