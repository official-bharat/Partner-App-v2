import {CommonConstants} from '../../../constants/commonConstants';
import {URLConstants} from '../../../constants/urlConstants';
import {DriverProfile, InterpreterProfile, Payout} from '../../../types/entity';
import {
  ChangePasswordRequest,
  GetPayoutRequest,
  QueryRecordsRequest,
  RespondToAuthChallengeRequest,
} from '../../../types/requests';
import {
  AuthChallenge,
  LoginRequest,
  TransporterProfile,
} from '../../../types/types';
import {CommonUtils} from '../../../utils/commonUtils';
import {ObjectFactory} from '../../../utils/objectFactory';
import {ApiRequest, ApiResponse} from '../../util/iHttpService';
import {IUserService} from '../iUserService';
const AppConstant = require('../../../../app.json');
/**
 * @author <Aniket.P>
 * @description User service implementation
 * @copyright Supra International, inc
 */
export class UserService implements IUserService {
  public async login(
    loginRequest: LoginRequest,
  ): Promise<ApiResponse<string | AuthChallenge>> {
    const httpClient = ObjectFactory.getHttpService();
    loginRequest.clientId = AppConstant.clientId;
    const loginResponse = await httpClient.post<string | AuthChallenge>({
      baseURL: AppConstant.serverUrl,
      url: URLConstants.HTTP_URL_LOGIN,
      data: loginRequest,
      loaderEvent: {
        show: true,
      },
    });
    if (
      loginResponse.success &&
      loginResponse.data &&
      typeof loginResponse.data === 'string'
    ) {
      await ObjectFactory.getCacheService().saveValue(
        CommonConstants.TOKEN_FIELD_NAME,
        loginResponse.data,
      );
      await ObjectFactory.getCacheService().setSessionInfo(loginResponse.data);
    }
    return loginResponse;
  }

  public async respondToAuthChallenge(
    respondToAuthChallenge: RespondToAuthChallengeRequest,
  ): Promise<ApiResponse<string>> {
    const httpClient = ObjectFactory.getHttpService();
    respondToAuthChallenge.clientId = AppConstant.clientId;
    const loginResponse = await httpClient.post<string>({
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_LOGIN}/respondToAuthChallenge`,
      data: respondToAuthChallenge,
      loaderEvent: {
        show: true,
      },
    });
    if (
      loginResponse.success &&
      loginResponse.data &&
      typeof loginResponse.data === 'string'
    ) {
      await ObjectFactory.getCacheService().saveValue(
        CommonConstants.TOKEN_FIELD_NAME,
        loginResponse.data,
      );
      await ObjectFactory.getCacheService().setSessionInfo(loginResponse.data);
    }
    return loginResponse;
  }

  // Get interpreter profile data for updation
  public async getInterpreterProfile(): Promise<
    ApiResponse<InterpreterProfile>
  > {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_INTERPRETERS}/${
        ObjectFactory.getContext().sessionInfo?.userId
      }`,
      loaderEvent: {
        show: true,
      },
    };
    const iHttpService = ObjectFactory.getHttpService();
    const apiResponse = await iHttpService.get<InterpreterProfile>(apiRequest);
    if (!apiResponse.success) {
      CommonUtils.showError(apiResponse);
    }
    return apiResponse;
  }
  public async getDriverProfile(): Promise<ApiResponse<DriverProfile>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_PARTNERS}/${
        ObjectFactory.getContext().sessionInfo?.userId
      }`,
      loaderEvent: {
        show: true,
      },
    };
    const iHttpService = ObjectFactory.getHttpService();
    const apiResponse = await iHttpService.get<DriverProfile>(apiRequest);
    if (!apiResponse.success) {
      CommonUtils.showError(apiResponse);
    }
    return apiResponse;
  }

  public async displayCertificate(fileName: string): Promise<ApiResponse<any>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_RESOURCE}/download/${fileName}`,
      responseType: 'arraybuffer',
      loaderEvent: {
        show: true,
      },
    };
    const fileBuffer = (await ObjectFactory.getHttpService().get<any>(
      apiRequest,
    )) as any;
    return fileBuffer;
  }

  // To change password of user
  public async changePassword(
    passwordChangeRequest: ChangePasswordRequest,
  ): Promise<ApiResponse<any>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_CHANGE_PASSWORD}`,
      data: passwordChangeRequest,
      loaderEvent: {
        show: true,
      },
    };
    const response = await ObjectFactory.getHttpService().put(apiRequest);
    if (!response.success) {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async getPayoutList(
    getPayoutRequest: GetPayoutRequest,
  ): Promise<ApiResponse<Payout[]>> {
    const queryRecordsRequest: QueryRecordsRequest = {
      conditions: [],
      limit: CommonConstants.PAGINATION_LIMIT,
      start: getPayoutRequest.start,
      order: getPayoutRequest.order ? getPayoutRequest.order : {createdOn: -1},
    };
    if (queryRecordsRequest.conditions) {
      queryRecordsRequest.conditions.push({
        fieldName: 'status',
        op: 'eq',
        value: getPayoutRequest.status,
      });
    }
    const iHttpService = ObjectFactory.getHttpService();
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_PAYOUTS}/list`,
      data: queryRecordsRequest,
      loaderEvent: {
        show: true,
      },
    };
    const response = await iHttpService.post<Payout[]>(apiRequest);
    if (!response.success && response.data) {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async getDriverList(
    start?: number,
  ): Promise<ApiResponse<DriverProfile[]>> {
    const queryRecordsRequest: QueryRecordsRequest = {
      conditions: [
        {
          op: 'eq',
          fieldName: 'status',
          value: 'ACTIVE',
        },
      ],
      limit: CommonConstants.DB_QUERY_MAX_RESULT,
      start,
    };
    const iHttpService = ObjectFactory.getHttpService();
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_TRANSPORTERS}/driver/list`,
      data: queryRecordsRequest,
      loaderEvent: {
        show: true,
      },
    };
    const response = await iHttpService.post<DriverProfile[]>(apiRequest);
    if (!response.success && response.data) {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async getTransporterProfile(): Promise<
    ApiResponse<TransporterProfile>
  > {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_TRANSPORTERS}/${
        ObjectFactory.getContext().sessionInfo?.userId
      }`,
      loaderEvent: {
        show: true,
      },
    };
    const iHttpService = ObjectFactory.getHttpService();
    const apiResponse = await iHttpService.get<TransporterProfile>(apiRequest);
    if (!apiResponse.success) {
      CommonUtils.showError(apiResponse);
    }
    return apiResponse;
  }
}
