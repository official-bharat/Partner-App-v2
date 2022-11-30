import {useEffect, useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import BackgroundGeolocation from 'react-native-geolocation-service';
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {getAsync} from '../utils/local-storage';
import {strictValidObjectWithKeys} from '../utils/common-utils';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const useTracking = (isActive) => {
  const [location, setLocation] = useState({
    latitude: 30.7046,
    longitude: 77.1025,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [history, setHistory] = useState([]);
  const [distance, setDistance] = useState(0);
  const getLocationFromStorage = async () => {
    const val = await getAsync('location');
    if (strictValidObjectWithKeys(val)) {
      setLocation({
        ...val,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  useEffect(() => {
    getLocationFromStorage();
  }, []);
  useEffect(() => {
    if (!isActive) {
      return;
    }
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 10,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      //debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER, // DISTANCE_FILTER_PROVIDER for
      interval: 1000,
      fastestInterval: 1000,
      activitiesInterval: 1000,
      stopOnStillActivity: false,
      url: 'http://192.168.81.15:3000/location',
      httpHeaders: {
        'X-FOO': 'bar',
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar', // you can also add your own properties
      },
    });

    BackgroundGeolocation.on('location', (location) => {
      //   alert(JSON.stringify(location));
      setLocation((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      setHistory((prev) => {
        setDistance((prevDistance) => {
          if (prev.length === 0) {
            return 0;
          }
          const latestItem = prev[prev.length - 1];
          return prevDistance;
          // getDistanceFromLatLonInKm(
          //   latestItem.latitude,
          //   latestItem.longitude,
          //   location.latitude,
          //   location.longitude,
          // )
        });

        return prev.concat({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      });
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask((taskKey) => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
    });

    BackgroundGeolocation.on('error', (error) => {
      //console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      //console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      //console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on('background', () => {});

    BackgroundGeolocation.on('foreground', () => {});

    BackgroundGeolocation.checkStatus((status) => {
      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, [location, isActive]);

  return {location, history, distance};
};

export default useTracking;
