import {ApiRequest, ApiResponse, IHttpService} from '../iHttpService';
import axios from 'axios';
import {CommonConstants} from '../../../constants/commonConstants';
import {ObjectFactory} from '../../../utils/objectFactory';
/**
 * @author <Aniket.P>
 * @description Axios HTTP service implementation
 * @copyright Supra International, inc
 */
export class AxiosHttpService implements IHttpService {
  private specialErrors: any = {
    'Request failed with status code 404': 'NETWORK_ERROR',
    'Network Error': 'ROUTE_NOT_FOUND',
  };

  public async post<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    request.method = 'POST';
    return this.executeHttpCall<T>(request);
  }

  public async get<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    request.method = 'GET';
    return this.executeHttpCall<T>(request);
  }

  public async put<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    request.method = 'PUT';
    return this.executeHttpCall<T>(request);
  }

  public async delete<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    request.method = 'DELETE';
    return this.executeHttpCall<T>(request);
  }

  private async executeHttpCall<T = any>(request: ApiRequest) {
    let apiResponse: ApiResponse<T> = {
      success: false,
    };
    let response = null;
    const loaderEvent = request.loaderEvent;
    const context = ObjectFactory.getContext();
    try {
      if (loaderEvent && loaderEvent.show && context) {
        // Show loader
        context.showLoader(true);
      }
      if (!request.timeout) {
        request.timeout = 10000;
      }
      await this.addAuthoriztionToken(request);
      response = await axios.request<ApiResponse<T>>(request);
      apiResponse.success = true;
      apiResponse.totalCount = response.data.totalCount;
    } catch (error) {
      if (error.message && this.specialErrors[error.message]) {
        apiResponse.errorCode = 'NETWORK_ERROR';
      } else {
        response = error.response;
      }
    } finally {
      if (loaderEvent && loaderEvent.show && context) {
        // Hide loader
        context.showLoader(false);
      }
      if (response) {
        if (typeof response.data === 'string') {
          apiResponse.data = response.data;
        } else {
          apiResponse = apiResponse = response.data;
        }
        apiResponse.headers = response.headers;
        apiResponse.statusCode = response.status;
        apiResponse.statusText = response.statusText;
      } else if (!apiResponse.errorCode) {
        apiResponse.errorCode = 'UNAUTHORIZED_REQUEST';
      }
    }
    return apiResponse;
  }

  private async addAuthoriztionToken(request: ApiRequest) {
    const idToken = await ObjectFactory.getCacheService().getValue(
      CommonConstants.TOKEN_FIELD_NAME,
    );
    const deviceId = await ObjectFactory.getCacheService().getValue(
      CommonConstants.DEVICE_ID_FIELD_NAME,
    );
    if (!request.headers) {
      request.headers = {};
    }
    if (idToken) {
      request.headers.Authorization = `Bearer ${idToken}`;
    }
    request.headers.origin = deviceId;
  }
}
