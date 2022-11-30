import { ICacheService } from '../iCacheService';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonUtils } from '../../../utils/commonUtils';
import { SessionInfo } from '../../../types/types';
import { CommonConstants } from '../../../constants/commonConstants';
/**
 * @author <Aniket.P>
 * @description Async storage service implementation
 * @copyright Supra International, inc
 */
export class AsyncStorageService implements ICacheService {
  public async saveValue(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  public async getValue(key: string): Promise<string> {
    const value = await AsyncStorage.getItem(key);
    return value ? value : '';
  }

  public async setSessionInfo(token: string): Promise<void> {
    const decodedToken = CommonUtils.parseJwt(token);
    const sessionInfo: SessionInfo = {
      expireTime: decodedToken.exp * 1000,
      fullname: decodedToken.fullname,
      scopes: decodedToken.scopes,
      status: decodedToken.status,
      userId: decodedToken.id,
      timezone: decodedToken.timezone,
    };
    await this.saveValue(
      CommonConstants.SESSION_FIELD_NAME,
      JSON.stringify(sessionInfo),
    );
  }

  public async getSessionInfo(): Promise<SessionInfo> {
    const value = await this.getValue(CommonConstants.SESSION_FIELD_NAME);
    return value ? (JSON.parse(value) as SessionInfo) : (null as any);
  }

  public async clearCache(): Promise<void> {
    const keys = ['id_token', 'session_info'];
    await AsyncStorage.multiRemove(keys);
  }
}
