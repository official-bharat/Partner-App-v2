import React from 'react';
import {ScrollView, View, BackHandler, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CommonStyles} from '../../../assets/styles/commonStyles';
import {Context} from '../../../constants/contextConstants';
import {PayoutDetailsState} from '../../../types/types';
import {InterpretationRequestStyles} from '../../../assets/styles/InterpretationRequestStyles';
import {CommonUtils} from '../../../utils/commonUtils';
import {IconConstants} from '../../../constants/iconConstants';
import {ColorConstants} from '../../../constants/colorConstants';
import {DateUtils} from '../../../utils/dateUtils';
import {MathUtils} from '../../../utils/mathUtils';
import {ComponentConstants} from '../../../constants/componentConstants';
import Header from '../../../common-components/header';
import {Card} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Text from '../../../common-components/Text';

/**
 * @author <Ajhar K>
 * @description Payout screen
 * @copyright Supra software solutions, inc
 */
export default class PayoutScreen extends React.Component<
  any,
  PayoutDetailsState
> {
  static contextType = Context.GlobalContext;
  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      payoutDetails: this.props.route.params.payoutInfo,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  private backAction = () => {
    this.props.navigation.navigate(ComponentConstants.PAYOUT_SCREEN_NAME);
    return true;
  };

  commonView = (label: any, value: any, changed: any) => {
    return (
      <View style={styles.labelBox}>
        <Text style={styles.label}>{label}</Text>
        <Text color={changed} style={styles.subtitle}>
          {value}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <Header centerText="Payout Details" />
        <ScrollView style={{flex: 1}}>
          <Card
            style={{
              marginHorizontal: wp(3),
              marginVertical: hp(2),
              borderRadius: 10,
            }}
            elevation={4}>
            <View style={InterpretationRequestStyles.detailsContainer}>
              {this.commonView(
                CommonUtils.translateMessageCode('amount'),
                MathUtils.formatCurrency(this.state.payoutDetails.amount),
                ColorConstants.BLACK,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('status'),
                this.state.payoutDetails.status,
                this.state.payoutDetails.status == 'Paid'
                  ? ColorConstants.GREEN
                  : ColorConstants.RED,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('remarks'),
                this.state.payoutDetails.remarks,
                ColorConstants.BLACK,
              )}
              {this.commonView(
                CommonUtils.translateMessageCode('createdOn'),
                DateUtils.formatDate(
                  this.state.payoutDetails.createdOn,
                  DateUtils.FORMAT_DATETIME_MONTH_AM_PM_12,
                ),
                ColorConstants.BLACK,
              )}
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  labelBox: {
    width: wp(80),
  },
  subtitle: {
    lineHeight: 25,
  },
  label: {
    lineHeight: 25,
    width: wp(35),
    color: ColorConstants.DARKGRAY,
    fontWeight: '700',
  },
});
