const messages = require('../i18n/Messages');
const errorCodes = require('../i18n/ErrorMessages');
import JWT from 'jwt-decode';
import {Alert} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ApiResponse} from '../services/util/iHttpService';
import {Address} from '../types/entity';
import {ObjectFactory} from './objectFactory';

/**
 * @author <Vinayak.S>
 * @description Common utils
 * @copyright Supra International, inc
 */
export class CommonUtils {
  public static translateMessageCode(messageCode: any): string {
    return messages[messageCode];
  }

  public static translateErrorCode(errorCode: any): string {
    return errorCodes[errorCode];
  }

  public static parseJwt(token: string): any {
    const decodedToken = JWT(token);
    return decodedToken;
  }

  public static showError(response: ApiResponse<any>) {
    let errorMessage = '';
    if (response.errors && response.errors.length > 0) {
      errorMessage = response.errors[0];
    } else if (response.errorCode) {
      errorMessage = CommonUtils.translateErrorCode(response.errorCode);
    }
    Toast.showWithGravity(errorMessage, Toast.SHORT, Toast.BOTTOM);
  }

  public static showConfirmation(
    title: string,
    onPresshandler: (value?: string) => {},
    onCancelhandler?: (value?: string) => {},
    message?: string,
    cancelTitle?: string,
    okTitle?: string,
  ) {
    Alert.alert(title, message, [
      {
        text: cancelTitle ? cancelTitle : 'Cancel',
        onPress: onCancelhandler ? onCancelhandler : () => {},
      },
      {text: okTitle ? okTitle : 'Ok', onPress: onPresshandler},
    ]);
  }
  public static showMessageConfirmation(
    title: string,
    onPresshandler: (value?: string) => {},
    message?: string,
    okTitle?: string,
  ) {
    Alert.alert(title, message, [
      {text: okTitle ? okTitle : 'Ok', onPress: onPresshandler},
    ]);
  }

  public static async logout() {
    await ObjectFactory.getCacheService().clearCache();
    ObjectFactory.getContext().checkUserIsLoggedIn();
  }
  public static parseGoogleAddress(place: any): Address {
    const addressComponenets = place.address_components;
    const zipComponent = this.findComponent(addressComponenets, 'postal_code');
    const countryComponent = this.findComponent(addressComponenets, 'country');
    const cityComponent = this.findComponent(
      addressComponenets,
      'administrative_area_level_2',
    );
    const stateComponent = this.findComponent(
      addressComponenets,
      'administrative_area_level_1',
    );
    const localityComponent = this.findComponent(
      addressComponenets,
      'locality',
    );
    const subLocalityComponent = this.findComponent(
      addressComponenets,
      'sublocality',
    );
    const address: Address = {
      fullAddress: place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      zip: zipComponent ? zipComponent.long_name : undefined,
      country: countryComponent ? countryComponent.long_name : undefined,
      city: cityComponent ? cityComponent.long_name : undefined,
      state: stateComponent ? stateComponent.long_name : undefined,
      subLocality: subLocalityComponent
        ? subLocalityComponent.long_name
        : undefined,
      locality: localityComponent ? localityComponent.long_name : undefined,
    };
    return address;
  }

  private static findComponent(
    addressComponenets: any[],
    componentId: string,
  ): any {
    let result;
    addressComponenets.forEach((addressComponenet) => {
      if (addressComponenet.types.indexOf(componentId) >= 0) {
        result = addressComponenet;
      }
    });
    return result;
  }
}
