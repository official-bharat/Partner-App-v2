import { Route, ServiceRequest } from '../../types/entity';
import { CompleteRequest, GetServiceRequestsInput, QueryRecordsRequest } from '../../types/requests';
import { ApiResponse } from '../util/iHttpService';

/**
 * @author <Vinayak.S>
 * @description Request service interface
 * @copyright Supra International, inc
 */
export interface IRequestService {
  getServiceRequests(
    getServiceRequestsInput: GetServiceRequestsInput,
  ): Promise<ApiResponse<ServiceRequest[]>>;

  getRequestDetails(requestId: string): Promise<ApiResponse<ServiceRequest>>;

  acceptRequest(requestId: string, dataBody?: any): Promise<ApiResponse<any>>;

  rejectRequest(requestId: string): Promise<ApiResponse<any>>;

  getMeetingUrl(userId: string): Promise<string>;

  completeRequest(
    requestId: string,
    completeRequest: CompleteRequest,
  ): Promise<ApiResponse<any>>;

  verifyAndCompleteRequest(
    requestId: string,
    identificationCode: string,
  ): Promise<ApiResponse<any>>;

  findRoutes(
    queryRecordsRequest: QueryRecordsRequest
  ): Promise<ApiResponse<Route[]>>;
}
