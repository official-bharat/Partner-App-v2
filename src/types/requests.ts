import {PayoutStatus, RequestStatus} from './entity';

export interface Condition {
  op: 'and' | 'or' | 'between' | 'gt' | 'lt' | 'eq' | 'in' | 'ne';
  fieldName: string;
  value: any;
  conditions?: Condition[];
}
export interface QueryRecordsRequest {
  conditions?: Condition[];
  outputProperties?: string[];
  limit?: number;
  start?: number;
  order?: {[key: string]: 1 | -1};
  serviceType?: string;
}
export interface GetServiceRequestsInput extends QueryRecordsRequest {
  status: RequestStatus;
  service:
    | 'interpreterRequest'
    | 'transportRequest'
    | 'deliveryRequest'
    | 'cmrRequest';
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  userId: string;
}
export interface CompleteRequest {
  startTime: string;
  appointmentDuration: number;
  noShow: boolean;
  additionalNotes: string;
}
export interface GetPayoutRequest extends QueryRecordsRequest {
  status: PayoutStatus;
}
export interface CompleteRouteRequest {
  requestId: string;
  waitingTime: number; // Time in milliseconds
}

export interface RespondToAuthChallengeRequest {
  challengeName: 'NEW_PASSWORD_REQUIRED';
  clientId: string;
  params: {
    newPassword?: string;
    username: string;
  };
  session: string;
}
