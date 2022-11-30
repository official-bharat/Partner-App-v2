/**
 * @author <Vinayak.S>
 * @description Request services to be used in view via iRequestServices
 * @copyright Supra software solutions, inc
 */
import {URLConstants} from '../../../constants/urlConstants';
import {Route, ServiceRequest} from '../../../types/entity';
import {
  CompleteRequest,
  GetServiceRequestsInput,
  QueryRecordsRequest,
} from '../../../types/requests';
import {CommonUtils} from '../../../utils/commonUtils';
import {ObjectFactory} from '../../../utils/objectFactory';
import {ApiRequest, ApiResponse} from '../../util/iHttpService';
import {IRequestService} from '../iRequestService';
const AppConstant = require('../../../../app.json');

export class RequestService implements IRequestService {
  public async getServiceRequests(
    getServiceRequestsInput: GetServiceRequestsInput,
  ): Promise<ApiResponse<ServiceRequest[]>> {
    const queryRecordsRequest: QueryRecordsRequest = {
      conditions: getServiceRequestsInput.conditions
        ? getServiceRequestsInput.conditions
        : [],
      order: getServiceRequestsInput.order
        ? getServiceRequestsInput.order
        : {
            createdOn: -1,
          },
      limit: getServiceRequestsInput.limit,
      start: getServiceRequestsInput.start,
      serviceType: getServiceRequestsInput.service,
    };
    if (queryRecordsRequest.conditions) {
      queryRecordsRequest.conditions.push({
        op: 'ne',
        fieldName: getServiceRequestsInput.service,
        value: null,
      });
      queryRecordsRequest.conditions.push({
        op: 'eq',
        fieldName: 'status',
        value: getServiceRequestsInput.status,
      });
    }
    const request: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_GET_REQUESTS}/list`,
      data: queryRecordsRequest,
      loaderEvent: {
        show: true,
      },
    };
    const response = await ObjectFactory.getHttpService().post<
      ServiceRequest[]
    >(request);
    if (!response.success) {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async acceptRequest(
    requestId: string,
    dataBody?: any,
  ): Promise<ApiResponse<any>> {
    const iHttpService = ObjectFactory.getHttpService();
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      data: dataBody,
      url: `${URLConstants.HTTP_URL_REQUESTS}/${requestId}/assign`,
      loaderEvent: {
        show: true,
      },
    };
    const response = await iHttpService.put<string>(apiRequest);
    if (!response.success) {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async getRequestDetails(requestId: string): Promise<ApiResponse<any>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_GET_REQUESTS}/${requestId}`,
      loaderEvent: {
        show: true,
      },
    };
    const response = await ObjectFactory.getHttpService().get<ServiceRequest>(
      apiRequest,
    );
    if (!response.success) {
      CommonUtils.showError(response);
    } else {
      if (response.data && response.data.transportRequest) {
        response.data.transportRequest.mapRoutes = await this.getRoutes(
          response.data.transportRequest.routes,
          AppConstant.serverUrl,
        );
        response.data.transportRequest.totalDistance = 0;
        response.data.transportRequest.mapRoutes.forEach((element: any) => {
          if (
            response.data &&
            response.data.transportRequest &&
            element.totalMiles
          ) {
            response.data.transportRequest.totalDistance += element.totalMiles;
          }
        });
      }
      if (response.data && response.data.deliveryRequest) {
        response.data.deliveryRequest.mapRoutes = await this.getRoutes(
          response.data.deliveryRequest.routes,
          AppConstant.serverUrl,
        );
      }
    }
    return response;
  }

  public async rejectRequest(requestId: string): Promise<ApiResponse<any>> {
    const iHttpService = ObjectFactory.getHttpService();
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_GET_REQUESTS}/${requestId}/reject`,
      loaderEvent: {
        show: true,
      },
    };
    const response = await iHttpService.put<string>(apiRequest);
    if (!response.success) {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async getMeetingUrl(userId: string): Promise<string> {
    const url =
      AppConstant.serverUrl + URLConstants.HTTP_URL_MEETING + `/${userId}`;
    return url;
  }

  public async completeRequest(
    requestId: string,
    completeRequest: CompleteRequest,
  ): Promise<ApiResponse<any>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_REQUESTS}/${requestId}/complete`,
      data: completeRequest,
      timeout: 50000,
      loaderEvent: {
        show: true,
      },
    };
    const response = await ObjectFactory.getHttpService().put<any>(apiRequest);
    if (response.success) {
      return response;
    } else {
      CommonUtils.showError(response);
    }
    return response;
  }

  public async verifyAndCompleteRequest(
    requestId: string,
    identificationCode: string,
  ): Promise<ApiResponse<any>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_REQUESTS}/${requestId}/verifyDelivery`,
      data: {requestId, identificationCode},
      timeout: 50000,
      loaderEvent: {
        show: true,
      },
    };
    const response = await ObjectFactory.getHttpService().put<any>(apiRequest);
    if (response.success) {
      return response;
    } else {
      CommonUtils.showError(response);
    }
    return response;
  }

  private async getRoutes(routes: Route[], baseURL: string): Promise<Route[]> {
    return new Promise<Route[]>((resolve, reject) => {
      if (routes) {
        const mapRoutes: Route[] = [];
        const promises: Array<Promise<ApiResponse<Route>>> = [];
        routes.forEach((element) => {
          const routeId = element.routeId;
          const apiRequest: ApiRequest = {
            baseURL,
            url: `${URLConstants.HTTP_URL_ROUTES}/${routeId}`,
            loaderEvent: {
              show: true,
            },
          };
          const iHttpService = ObjectFactory.getHttpService();
          const requestPromise = iHttpService.get<Route>(apiRequest);
          promises.push(requestPromise);
        });
        Promise.all(promises)
          .then((responses) => {
            let index = 0;
            responses.forEach((response) => {
              if (response.success && response.data) {
                const route = response.data;
                const origin = {
                  lat: route.pickupAddress.latitude,
                  lng: route.pickupAddress.longitude,
                  icon: 'ambulance-icon.png',
                };
                const destination = {
                  lat: route.dropoffAddress.latitude,
                  lng: route.dropoffAddress.longitude,
                  icon: 'hospital-icon.png',
                };
                const googleMapRoute: any = {
                  destination,
                  markers: [{position: origin}, {position: destination}],
                  origin,
                };
                if (index++ > 1) {
                  destination.icon = 'home-icon.png';
                }
                route.googleMap = googleMapRoute;
                mapRoutes.push(route);
              } else {
                CommonUtils.showError(response);
              }
            });
            resolve(mapRoutes);
          })
          .catch(() => {
            reject('Failed to get route');
          });
      }
    });
  }

  public async findRoutes(
    queryRecordsRequest: QueryRecordsRequest,
  ): Promise<ApiResponse<Route[]>> {
    const apiRequest: ApiRequest = {
      baseURL: AppConstant.serverUrl,
      url: `${URLConstants.HTTP_URL_ROUTES}/list`,
      data: queryRecordsRequest,
      timeout: 50000,
      loaderEvent: {
        show: true,
      },
    };
    const response = await ObjectFactory.getHttpService().post<Route[]>(
      apiRequest,
    );
    if (response.success && response.data) {
      return response;
    } else {
      CommonUtils.showError(response);
      throw 'Error while getting routes';
    }
  }
}
