/**
 * @author <Aniket.P>
 * @description Object Factory
 * @copyright Supra International, inc
 */
import {ICacheService} from '../services/util/iCacheService';
import {IHttpService} from '../services/util/iHttpService';
import {IUserService} from '../services/domain/iUserService';
import {UserService} from '../services/domain/impl/userService';
import {AsyncStorageService} from '../services/util/impl/asyncStorageService';
import {AxiosHttpService} from '../services/util/impl/axiosHttpService';
import {GlobalContextInput} from '../constants/contextConstants';
import {IRequestService} from '../services/domain/iRequestService';
import {RequestService} from '../services/domain/impl/requestService';

export class ObjectFactory {
  public static getHttpService(): IHttpService {
    if (!this.iHttpService) {
      this.iHttpService = new AxiosHttpService();
    }
    return this.iHttpService;
  }

  public static getCacheService(): ICacheService {
    if (!this.iCacheService) {
      this.iCacheService = new AsyncStorageService();
    }
    return this.iCacheService;
  }

  public static getUserService(context: GlobalContextInput): IUserService {
    this.setContext(context);
    if (!this.iUserService) {
      this.iUserService = new UserService();
    }
    return this.iUserService;
  }

  public static getRequestService(
    context: GlobalContextInput,
  ): IRequestService {
    this.setContext(context);
    if (!this.iRequestService) {
      this.iRequestService = new RequestService();
    }
    return this.iRequestService;
  }

  public static getContext(): GlobalContextInput {
    return this.context;
  }

  public static setContext(context: GlobalContextInput) {
    if (context) {
      this.context = context;
    }
  }

  private static iHttpService: IHttpService;
  private static iCacheService: ICacheService;
  private static iUserService: IUserService;
  private static context: GlobalContextInput;
  private static iRequestService: IRequestService;
}
