import React from 'react';
import {FlatList, Platform, Text, TouchableOpacity, View} from 'react-native';
import {Context} from '../../constants/contextConstants';
import {PayoutListState} from '../../types/types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ObjectFactory} from '../../utils/objectFactory';
import {Appbar, Divider, List, Menu} from 'react-native-paper';
import {CommonStyles, HeaderTheme} from '../../assets/styles/commonStyles';
import {Payout, PayoutStatus} from '../../types/entity';
import {CommonUtils} from '../../utils/commonUtils';
import {ColorConstants} from '../../constants/colorConstants';
import {MathUtils} from '../../utils/mathUtils';
import {DateUtils} from '../../utils/dateUtils';
import {InterpretationStyles} from '../../assets/styles/interpretationStyles';
import {IconConstants} from '../../constants/iconConstants';
import {ComponentConstants} from '../../constants/componentConstants';
import EmptyFile from '../../common-components/emptyFile';
/**
 * @author <Azhar K>
 * @description Payout screen
 * @copyright Supra software solutions, inc
 */
export default class PayoutScreen extends React.Component<
  any,
  PayoutListState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      status: 'Pending',
      payoutList: [],
      totalCount: 0,
      openMenu: false,
    };
  }

  private getPayoutList = async (start: number, status?: PayoutStatus) => {
    this.setState({openMenu: false});
    if (status) {
      this.setState({status: status});
    }
    const userService = ObjectFactory.getUserService(this.context);
    const response = await userService.getPayoutList({
      status: status || this.state.status,
      start,
    });
    if (response.success && response.data) {
      this.setState({payoutList: response.data});
      if (response.totalCount) {
        this.setState({totalCount: response.totalCount});
      }
    } else {
      this.setState({payoutList: []});
      CommonUtils.showError(response);
    }
  };

  componentDidMount() {
    this.getPayoutList(0);
    this.props.navigation.addListener('focus', () => {
      this.getPayoutList(0);
    });
  }

  private getListItem = (payout: Payout) => {
    return (
      <TouchableOpacity
        style={{borderBottomWidth: 1, borderBottomColor: ColorConstants.GRAY}}
        onPress={() => {
          // Go to payout details
          this.props.navigation.navigate(
            ComponentConstants.PAYOUT_DETAILS_SCREEN_NAME,
            {payoutInfo: payout},
          );
        }}>
        <List.Item
          title={MathUtils.formatCurrency(payout.amount)}
          description={({ellipsizeMode, color: descriptionColor, fontSize}) => (
            <View>
              <Text
                numberOfLines={2}
                ellipsizeMode={ellipsizeMode}
                style={{color: descriptionColor, fontSize, marginLeft: -4}}>
                {' '}
                {DateUtils.formatDate(
                  payout.createdOn,
                  DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                )}{' '}
              </Text>
            </View>
          )}
          left={(props) => <PayoutIcon />}
        />
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <View style={CommonStyles.container}>
        <Appbar.Header theme={HeaderTheme}>
          <Appbar.Content
            title={CommonUtils.translateMessageCode('payouts')}
            style={{marginLeft: Platform.OS === 'ios' ? '-50%' : 0}}
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
              <Menu.Item
                title={CommonUtils.translateMessageCode('pending')}
                onPress={() => {
                  this.getPayoutList(0, 'Pending');
                }}
              />
              <Divider />
              <Menu.Item
                title={CommonUtils.translateMessageCode('paid')}
                onPress={() => {
                  this.getPayoutList(0, 'Paid');
                }}
              />
              <Divider />
              <Menu.Item
                title={CommonUtils.translateMessageCode('rejected')}
                onPress={() => {
                  this.getPayoutList(0, 'Rejected');
                }}
              />
            </Menu>
          </TouchableOpacity>
        </Appbar.Header>
        <FlatList
          data={this.state.payoutList}
          renderItem={({item}) => this.getListItem(item)}
          keyExtractor={(item) => item.id as any}
          ListEmptyComponent={<EmptyFile text="No Payouts found" />}
          contentContainerStyle={{flexGrow: 1}}
        />
      </View>
    );
  }
}
class PayoutIcon extends React.Component {
  render() {
    return (
      <View style={InterpretationStyles.circleLeft}>
        <Icon
          style={InterpretationStyles.iconLeft}
          name={IconConstants.MONEY}
          color={ColorConstants.GREEN}
          size={IconConstants.ICON_SIZE_20}
        />
      </View>
    );
  }
}
