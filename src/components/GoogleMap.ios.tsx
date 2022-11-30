import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  Linking,
  Keyboard,
} from 'react-native';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {images} from '../assets';
import Header from '../common-components/header';
import Loader from '../common-components/LoadingView';
import useTracking from '../common-components/useTracking';
import {ComponentConstants} from '../constants/componentConstants';
import {URLConstants} from '../constants/urlConstants';
import {ApiRequest} from '../services/util/iHttpService';
import {ObjectFactory} from '../utils/objectFactory';
import {CommonUtils} from '../utils/commonUtils';
import Button from '../common-components/Button';
import {light} from '../common-components/theme/colors';
import {Modalize} from 'react-native-modalize';
import {InterpretationRequestStyles} from '../assets/styles/InterpretationRequestStyles';
import {RadioButton, TextInput} from 'react-native-paper';
import {ColorConstants} from '../constants/colorConstants';
import {DateUtils} from '../utils/dateUtils';
import Block from '../common-components/Block';
const home = require('../assets/images/home-icon.png');
const AppConstant = require('../../app.json');

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Home = () => {
  const {location} = useTracking('running');
  const modalizeRef = useRef<Modalize>(null);
  const [loader, setLoader] = useState(false);
  const mapRef = useRef();
  const {params} = useRoute();
  const googleMap = params.mapRoute;
  const {width, height} = Dimensions.get('window');
  const {navigate} = useNavigation();
  const [waitingTime, setWaiting] = useState(false);
  const [Minutes, setMinutes] = useState('00');
  const [Hours, setHours] = useState('');
  const [defaultHeight] = useState(heightPercentageToDP(35));
  const getTripDetails = (routeId: string) => {
    if (params && params.serviceRequest.transportRequest) {
      const index = params.serviceRequest.transportRequest.mapRoutes.findIndex(
        (element) => {
          return (element.id = routeId);
        },
      );
      if (index >= 0) {
        return params.serviceRequest.transportRequest.mapRoutes[index]
          .tripDetails;
      }
    }
    return null;
  };
  const [tripDetails, setTripDetals] = useState({
    ...getTripDetails(params.routeId),
  });

  const [state, setState] = useState({
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
  });
  const {curLoc, time, distance, destinationCords, isLoading} = state;
  const navType =
    params.type === 'Delivery'
      ? ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME
      : ComponentConstants.TRANSPORTATION_SCREEN_NAME;

  const backNavigation =
    params.type === 'Delivery'
      ? ComponentConstants.DELIVERY_REQUEST_SCREEN_NAME
      : ComponentConstants.TRANSPORTATION_REQUEST_SCREEN_NAME;
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        heightPercentageToDP(60);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        heightPercentageToDP(35);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const GOOGLE_MAPS_APIKEY =
    Platform.OS === 'ios'
      ? AppConstant.iosGoogleKey
      : AppConstant.androidGoogleKey;

  useEffect(() => {
    animate();
    sendMyCurrentLocation();
  }, [location]);

  const confirmPickup = async () => {
    const iHttpService = ObjectFactory.getHttpService();
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_ROUTES}/${params.requestId}/${params.routeId}/PatientPickedUp`,
    };
    const response = await iHttpService.put<string>(apiRequest);
    if (response.success) {
      setTripDetals({
        ...tripDetails,
        patientPickedUpAt: DateUtils.getCurrentTimeInMillis(),
      });
    } else {
      CommonUtils.showError(response);
    }
    return response;
  };

  const animate = () => {
    const newCoordinate = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    if (location !== newCoordinate) {
      // mapRef.current?.animateToCoordinate(newCoordinate, 1);
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion(location);
  };

  const fetchTime = (d: any, t: any) => {
    setState((state) => ({...state, distance: d, time: t}));
  };

  const sendMyCurrentLocation = async () => {
    const iHttpService = ObjectFactory.getHttpService();
    const dataBody = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      data: dataBody,
      url: `${URLConstants.HTTP_URL_ROUTES}/${params.requestId}/${params.routeId}/location`,
    };
    const response = await iHttpService.put<string>(apiRequest);
    if (response.success) {
    } else {
      CommonUtils.showError(response);
    }
    return response;
  };

  const completeTrip = async () => {
    setLoader(true);
    const waitingValue =
      DateUtils.convertMinutesToMillis(Hours * 60) +
      DateUtils.convertMinutesToMillis(Minutes);
    const iHttpService = ObjectFactory.getHttpService();
    const dataBody = {
      requestId: params.requestId,
      waitingTime: Hours ? waitingValue : 0, // Time in milliseconds
    };
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      data: dataBody,
      url: `${URLConstants.HTTP_URL_ROUTES}/${params.routeId}/complete`,
    };
    const response = await iHttpService.put<string>(apiRequest);
    if (response.success) {
      navigate(navType);
      setLoader(false);
    } else {
      CommonUtils.showError(response);
      setLoader(false);
    }
  };

  const completeDeliveryNavigate = () => {
    navigate(ComponentConstants.DELIVERY_DETAIL_SCREEN_NAME, {
      data: params.deliveryRoutes,
      serviceRequest: params.serviceRequest,
    });
  };

  useEffect(() => {
    setState({
      ...state,
      destinationCords: {
        latitude: googleMap.destination.lat,
        longitude: googleMap.destination.lng,
      },
    });
  }, [googleMap]);

  const destinationMap = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${googleMap.destination.lat},${googleMap.destination.lng}`;
    const label = 'Destination Address';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    }) as string;

    Linking.openURL(url);
  };
  const pickupMap = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${googleMap.origin.lat},${googleMap.origin.lng}`;
    const label = 'Patient Pickup Address';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    }) as string;

    Linking.openURL(url);
  };

  const onOpen = () => {
    navigate(ComponentConstants.COMPLETE_TRIP_SCREEN_NAME, {
      navType: params.type,
      requestId: params.requestId,
      routeId: params.routeId,
    });
    // modalizeRef.current?.open();
  };

  const checkDisabled = () => {
    if (waitingTime) {
      if (Hours && Minutes) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  return (
    <View style={styles.container}>
      <Header
        customNav={true}
        leftIcon={false}
        onPress={() =>
          navigate(backNavigation, {
            requestService: params.serviceRequest,
          })
        }
        centerText="Map Route"
      />
      {distance !== 0 && time !== 0 && (
        <View style={{alignItems: 'center', marginVertical: 16}}>
          <Text>Time left: {time.toFixed(0)} </Text>
          <Text>Distance left: {distance.toFixed(0)}</Text>
        </View>
      )}
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          showsUserLocation
          style={StyleSheet.absoluteFill}
          initialRegion={location}>
          {Object.keys(destinationCords).length > 0 && (
            <Marker coordinate={destinationCords}>
              <Image source={home} style={{height: 40, width: 40}} />
            </Marker>
          )}

          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={6}
              strokeColor="red"
              optimizeWaypoints={true}
              onReady={(result) => {
                fetchTime(result.distance, result.duration),
                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: width / 20,
                      bottom: height / 20,
                      left: width / 20,
                      top: height / 20,
                    },
                  });
              }}
              onError={(errorMessage) => {}}
            />
          )}
        </MapView>
        <TouchableOpacity onPress={onCenter} style={styles.gps}>
          <Image
            source={images.gps}
            style={{height: 30, width: 30, tintColor: light.facebook}}
          />
        </TouchableOpacity>
        <View style={styles.customMarker}>
          <Button
            iconWithText={true}
            icon={images.direction_arrow}
            iconHeight={20}
            iconWidth={20}
            onPress={() => destinationMap()}
            style={{width: widthPercentageToDP(27)}}
            color={'facebook'}>
            Drop-off
          </Button>
        </View>
        <View style={styles.pickupcustomMarker}>
          <Button
            iconWithText={true}
            icon={images.direction_arrow}
            iconHeight={20}
            iconWidth={20}
            onPress={() => pickupMap()}
            style={{width: widthPercentageToDP(27)}}
            color={'facebook'}>
            Pickup
          </Button>
        </View>
        {(tripDetails && tripDetails.patientPickedUpAt) || !tripDetails ? (
          <View style={styles.completeTrip}>
            <Button
              onPress={() =>
                params.type === 'Delivery'
                  ? completeDeliveryNavigate()
                  : onOpen()
              }
              iconWithText={true}
              icon={images.checkmark}
              iconHeight={17}
              iconWidth={17}
              style={{width: widthPercentageToDP(43)}}
              color={'facebook'}>
              {params.type === 'Delivery'
                ? 'Complete Delivery'
                : 'Complete Trip'}
            </Button>
          </View>
        ) : (
          <View style={styles.confirmPatientPickedUp}>
            <Button
              onPress={() =>
                CommonUtils.showConfirmation(
                  '',
                  confirmPickup,
                  undefined,
                  'Did you pick up patient from the location?',
                  'No',
                  'Yes',
                )
              }
              iconWithText={true}
              icon={images.checkmark}
              iconHeight={17}
              iconWidth={17}
              style={{width: widthPercentageToDP(60)}}
              color={'facebook'}>
              {'Confirm Patient Picked up'}
            </Button>
          </View>
        )}
      </View>
      <Modalize
        handlePosition="inside"
        modalHeight={defaultHeight}
        ref={modalizeRef}>
        <View>
          <View style={InterpretationRequestStyles.labelComplete}>
            <Text
              style={[
                InterpretationRequestStyles.labelCompleteLine,
                {fontSize: 16},
              ]}>
              Was there a request for the driver to wait ?
            </Text>
          </View>
          <View style={InterpretationRequestStyles.radioGroup}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                // this.setState({isWaiting: newValue});
                if (newValue) {
                  setWaiting(newValue);
                } else {
                  setWaiting(newValue);
                  setHours('');
                  setMinutes('');
                }
              }}
              value={waitingTime}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <RadioButton value={true} color={ColorConstants.GREEN} />
                  <RadioButton value={false} color={ColorConstants.GREEN} />
                </View>
                <View>
                  <Text
                    onPress={() => {
                      // this.setState({isWaiting: true});
                      setWaiting(true);
                    }}
                    style={{marginTop: heightPercentageToDP(1)}}>
                    Yes
                  </Text>
                  <Text
                    onPress={() => {
                      // this.setState({isWaiting: false});
                      setWaiting(false);
                      setHours('');
                      setMinutes('');
                    }}
                    style={{marginTop: heightPercentageToDP(2)}}>
                    No
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
            {waitingTime && (
              <>
                <Text
                  style={[
                    InterpretationRequestStyles.labelCompleteLine,
                    {fontSize: 16},
                  ]}>
                  What was the waiting time ?
                </Text>

                <Block row>
                  <TextInput
                    mode="outlined"
                    style={{
                      marginRight: widthPercentageToDP(3),
                      width: widthPercentageToDP(25),
                    }}
                    placeholder="Hours"
                    label="Hours"
                    maxLength={2}
                    keyboardType="number-pad"
                    onChangeText={(s) => {
                      if (Number(s) > 12) {
                        setHours('');
                      } else {
                        setHours(s);
                      }
                    }}
                    value={Hours}
                  />
                  <TextInput
                    mode="outlined"
                    style={{
                      width: widthPercentageToDP(25),
                    }}
                    placeholder="Minutes"
                    label="Minutes"
                    maxLength={2}
                    keyboardType="number-pad"
                    onChangeText={(s) => {
                      if (Number(s) > 60) {
                        setMinutes('');
                      } else if (!Hours) {
                        setHours('00');
                      } else {
                        setMinutes(s);
                      }
                    }}
                    value={Minutes}
                  />
                </Block>
              </>
            )}
            <Button
              isLoading={loader}
              disabled={checkDisabled()}
              onPress={completeTrip}
              style={{width: widthPercentageToDP(60), alignSelf: 'center'}}
              color={'secondary'}>
              Submit
            </Button>
          </View>
        </View>
      </Modalize>
      {isLoading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
  customMarker: {
    position: 'absolute',
    // top: heightPercentageToDP(1),
    right: widthPercentageToDP(8),
    height: 60,
    width: 60,
    borderRadius: 60,

    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupcustomMarker: {
    position: 'absolute',
    right: widthPercentageToDP(38),
    height: 60,
    width: 60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gps: {
    position: 'absolute',
    bottom: 10,
    right: widthPercentageToDP(3),
    height: 60,
    width: 60,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeTrip: {
    position: 'absolute',
    bottom: 10,
    right: widthPercentageToDP(30),
  },
  confirmPatientPickedUp: {
    position: 'absolute',
    bottom: 10,
    right: widthPercentageToDP(20),
  },
});

export default Home;
