import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import CustomText from '../common-components/Text';
import { InterpretationRequestStyles } from '../assets/styles/InterpretationRequestStyles';
import Block from '../common-components/Block';
import Button from '../common-components/Button';
import Header from '../common-components/header';
import { ColorConstants } from '../constants/colorConstants';
import { ComponentConstants } from '../constants/componentConstants';
import { Context } from '../constants/contextConstants';
import { strictValidObjectWithKeys } from '../utils/common-utils';
import { CommonUtils } from '../utils/commonUtils';
import { DateUtils } from '../utils/dateUtils';
import { MathUtils } from '../utils/mathUtils';
const RouteDetailsScreen = () => {
  const { params } = useRoute();
  const { navigate } = useNavigation();
  const context = useContext(Context.GlobalContext);
  const { data, serviceRequest } = params;
  console.log('params: ', params);

  const styles = StyleSheet.create({
    labelBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // alignItems: 'center',
    },
    subtitle: {
      color: ColorConstants.DARKGRAY,
      lineHeight: 25,
      width: widthPercentageToDP(47),
      textAlign: 'right',
    },
    label: {
      lineHeight: 25,
      width: widthPercentageToDP(40),
    },
  });


  const isAllRoutesCompleted = () => {
    let isCompleted = true;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.status !== 'Completed') {
        return false;
      }
    }
    return isCompleted;
  };
  const commonView = (label, value) => {
    return value ? (
      <View style={styles.labelBox}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subtitle}>{value}</Text>
      </View>
    ) : <></>;
  };
  const renderItem = ({ item, index }) => {
    return (
      <Block
        flex={false}
        margin={[heightPercentageToDP(1), widthPercentageToDP(3)]}
        shadow
        borderRadius={10}
        color="#fff"
        padding={[heightPercentageToDP(2), widthPercentageToDP(3)]}>
        {commonView(
          `Route ${index === 0 ? 'A' : 'B'}`,
          `${item.pickupAddress.fullAddress.split(',')[0]} to
          ${item.dropoffAddress.fullAddress.split(',')[0]}`,
        )}
        {item.pickupAddress.apartment &&
          commonView('Apartment/suite name', item.pickupAddress.apartment)}
        {commonView(
          CommonUtils.translateMessageCode('pickupAddress'),
          item.pickupAddress.fullAddress,
        )}
        {item.dropoffAddress.apartment &&
          commonView('Building', item.dropoffAddress.apartment)}
        {commonView(
          CommonUtils.translateMessageCode('dropoffAddress'),
          item.dropoffAddress.fullAddress,
        )}
        {item.status !== 'Completed' && (
          <>
            {commonView(
              CommonUtils.translateMessageCode('pickupTime'),
              DateUtils.formatDate(
                item.pickupTime,
                DateUtils.FORMAT_DATETIME_AM_PM_12,
              ),
            )}
            {commonView(
              CommonUtils.translateMessageCode('expectedArrivalTime'),
              DateUtils.formatDate(
                item.expectedArrivalTime,
                DateUtils.FORMAT_DATETIME_AM_PM_12,
              ),
            )}
          </>
        )}
        {commonView(
          CommonUtils.translateMessageCode('totalDistance'),
          `${item.totalMiles} Miles`,
        )}
        {commonView(
          CommonUtils.translateMessageCode('vehicalType'),
          serviceRequest?.transportRequest?.vehicleType,
        )}
        {serviceRequest.deliveryRequest &&
          serviceRequest.deliveryRequest.deliveredOn
          ? commonView(
            'Delivered At',
            DateUtils.formatDate(
              this.state.serviceRequest.deliveryRequest.deliveredOn,
              DateUtils.FORMAT_DATETIME_AM_PM_12,
            ),
          )
          : null}
        {item.estimatedPayout &&
          item.status !== 'Completed' &&
          !context.sessionInfo.scopes.includes('driver')
          ? commonView(
            CommonUtils.translateMessageCode('estimatedPayOut'),
            MathUtils.formatCurrency(item.estimatedPayout),
          )
          : null}
        {commonView(
          item.status === 'Completed' ? 'Completed By' : 'Assigned Driver',
          item.driverName,
        )}
        {item.dropoffAddress && item.dropoffAddress.dropOffInstruction && item.dropoffAddress.dropOffInstruction.length > 0 ? commonView(
          'Drop-off Instructions',
          item.dropoffAddress.dropOffInstruction,
        ) : <></>}
        {item.pickupAddress && item.pickupAddress.pickupInstruction && item.pickupAddress.pickupInstruction.length > 0 ? commonView(
          'Pick-up Instructions',
          item.pickupAddress.pickupInstruction,
        ) : <></>}
        {item.status === 'Completed'
          ? commonView(
            'Completed On',
            DateUtils.formatDate(
              item.lastModifiedOn,
              DateUtils.FORMAT_DATETIME_AM_PM_12,
            ),
          )
          : null}
        {strictValidObjectWithKeys(item.params)
          ? commonView(
            'Waiting Time',
            DateUtils.getDurationText(
              DateUtils.convertMillisToMinutes(item.params.waitingTime),
            ),
          )
          : null}
        <Block center={true} middle={true} flex={false} row space="between">
          {item.driverName &&
            context.sessionInfo.scopes.includes('driver') &&
            item.status === 'Accepted' ? (
            <Button
              style={{ width: widthPercentageToDP(88) }}
              onPress={() =>
                navigate(
                  ComponentConstants.COMPLETE_DELIVERY_REQUEST_SCREEN_NAME,
                  {
                    routeId: item.id,
                    requestId: serviceRequest.id,
                    serviceRequest: serviceRequest,
                    mapRoute: item.googleMap,
                    type: 'Transportation',
                    data: data,
                  },
                )
              }
              color="secondary">
              Start Trip
            </Button>
          ) : null}
          {item.driverName &&
            item.status === 'In-Progress' ? (
            <Button
              style={{ width: widthPercentageToDP(88) }}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  navigate(ComponentConstants.GOOGLE_MAP_SCREEN_NAME, {
                    routeId: item.id,
                    requestId: serviceRequest.id,
                    serviceRequest: serviceRequest,
                    mapRoute: item.googleMap,
                    type: 'Transporatation',
                  });
                } else {
                  navigate(ComponentConstants.GOOGLE_MAP_Android_SCREEN_NAME, {
                    routeId: item.id,
                    requestId: serviceRequest.id,
                    serviceRequest: serviceRequest,
                    mapRoute: item.googleMap,
                    type: 'Transporatation',
                    data: data,
                  });
                }
              }}
              color="secondary">
              Go to Map
            </Button>
          ) : null}
        </Block>
        <Block flex={false} row space="between">
          {item.driverName &&
            context.sessionInfo.scopes.includes('transporter') &&
            item.status === 'Accepted' ? (
            <Button
              style={{ width: widthPercentageToDP(42) }}
              onPress={() =>
                navigate(
                  ComponentConstants.COMPLETE_DELIVERY_REQUEST_SCREEN_NAME,
                  {
                    routeId: item.id,
                    requestId: serviceRequest.id,
                    serviceRequest: serviceRequest,
                    mapRoute: item.googleMap,
                    type: 'Transportation',
                    data: data,
                  },
                )
              }
              color="secondary">
              Start Trip
            </Button>
          ) : null}
          <Block flex={false} row space="between">
            {item.driverName ? (
              <View style={InterpretationRequestStyles.labelContainer}>
                {item.driverName &&
                  context.sessionInfo.scopes.includes('transporter') &&
                  item.status === 'Accepted' ? (
                  <Button
                    style={{ width: widthPercentageToDP(42) }}
                    onPress={() =>
                      navigate(ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME, {
                        routeId: item.id,
                        serviceRequest: serviceRequest,
                        title: 'Change Driver',
                      })
                    }
                    color="primary">
                    Change Driver
                  </Button>
                ) : null}
              </View>
            ) : null}
            {!item.driverName && item.status === 'Accepted' ? (
              <Button
                style={{ width: widthPercentageToDP(42) }}
                onPress={() =>
                  navigate(ComponentConstants.ASSIGN_DRIVER_SCREEN_NAME, {
                    routeId: item.id,
                    serviceRequest: serviceRequest,
                    title: 'Assign Driver',
                  })
                }
                color="primary">
                {CommonUtils.translateMessageCode('assignDriver')}
              </Button>
            ) : null}
          </Block>
        </Block>

        <Block flex={false} row space="between">
          {item.driverName &&
            context.sessionInfo.scopes.includes('driver') &&
            serviceRequest.deliveryRequest &&
            !serviceRequest.deliveryRequest.deliveredOn &&
            item.status === 'Accepted' ? (
            <Button
              style={{ width: widthPercentageToDP(42) }}
              onPress={() =>
                navigate(
                  ComponentConstants.COMPLETE_DELIVERY_REQUEST_SCREEN_NAME,
                  {
                    routeId: item.id,
                    requestId: serviceRequest.id,
                    serviceRequest: serviceRequest,
                    type: 'Transportation',
                  },
                )
              }
              color="secondary">
              Complete Delivery
            </Button>
          ) : null}
        </Block>
      </Block>
    );
  };
  return (
    <Block primary>
      <Header centerText="Route Details" />
      {context.sessionInfo.scopes.includes('driver') &&
        !isAllRoutesCompleted() && (
          <CustomText
            margin={[heightPercentageToDP(1)]}
            accent
            center
            size={12}>
            Please hit Start Trip button to get pickup and destination address
          </CustomText>
        )}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
      />
    </Block>
  );
};

export default RouteDetailsScreen;
