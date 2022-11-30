import MapView from 'react-native-maps';
import {
  coordinates,
  InterpreterProfile,
  Payout,
  PayoutStatus,
  RequestStatus,
  Route,
  Scope,
  ServiceRequest,
  UserStatus,
  DriverProfile,
  Address,
  CMRRequest,
} from './entity';
export interface AppState {
  isUserLoggedIn: boolean;
  showLoader: boolean;
  progress: boolean;
}

export interface LoginState {
  email: string;
  emailValid: boolean;
  password: string;
  passwordValid: boolean;
  showPassword: boolean;
  isSupported: boolean;
}

export interface RegisterState {
  name: string;
  email: string;
  phone: string;
  password: string;
  showPassword: boolean;
}

export interface TextField<T> {
  valid: boolean;
  value: T;
  dirty: boolean;
}

export interface SessionInfo {
  id: string;
  userId: string;
  scopes: Scope[];
  status: UserStatus;
  fullname: string;
  timezone: string;
  expireTime: number;
}

export interface LoginRequest {
  /**
   * username can be email/mobileno
   */
  username: string;
  /**
   * Password
   */
  password: string;
  /**
   * clientId is application ID (Request portal/Admin portal/Partner Portal)
   */
  clientId?: string;
}

export interface HomeState {
  fullname: string;
}

export interface SettingState {
  interpreterProfile?: InterpreterProfile;
  transporterProfile?: TransporterProfile;
  driverProfile?: DriverProfile;
  loader: boolean;
}
export interface InterpretationState {
  status: RequestStatus;
  serviceRequests: ServiceRequest[];
  totalCount: number;
  openMenu: boolean;
  loader: boolean;
}
export interface InterpretationRequestState {
  serviceRequest?: ServiceRequest;
}

export interface CMRState {
  status: RequestStatus;
  serviceRequests: CMRRequest[];
  totalCount: number;
  openMenu: boolean;
  loader: boolean;
}

export interface TransportRequestState {
  serviceRequest?: ServiceRequest;
  mapView?: MapView;
  route1?: Route;
  route2?: Route;
  viewMap: boolean;
  tab1: boolean;
  tab2: boolean;
  loader: boolean;
}
export interface DeliveryRequestState {
  serviceRequest?: ServiceRequest;
  mapView?: MapView;
  route1?: Route;
  route2?: Route;
  viewMap: boolean;
  tab1: boolean;
  tab2: boolean;
}
export interface ChangePasswordState {
  oldPassword: TextField<string>;
  newPassword: TextField<string>;
  confirmPassword: TextField<string>;
  showPassword: boolean;
}

export interface NewPasswordState {
  newPassword: TextField<string>;
  confirmPassword: TextField<string>;
  showPassword: boolean;
}
export interface CompleteRequestState {
  startTime: Date;
  showStartTimepicker: boolean;
  showEndTimepicker: boolean;
  selectedStartTime: string;
  selectedEndTime: string;
  additionalNotes: string;
  appointmentDuration: string;
  noShow: boolean;
}
export interface PayoutListState {
  status: PayoutStatus;
  payoutList: Payout[];
  totalCount: number;
  openMenu: boolean;
}
export interface PayoutDetailsState {
  payoutDetails: Payout;
}
export interface AssignDriverState {
  serviceRequest?: ServiceRequest;
  routeId?: string;
  drivers?: DriverList[];
  driverId?: string;
  disableSubmit: boolean;
}
export interface CompleteRouteState {
  serviceRequest?: ServiceRequest;
  routeId?: string;
  isWaiting: string;
  waitingHours: number;
  waitingMinutes: number;
  disableSubmit: boolean;
}
export interface DriverList {
  label: string;
  value: string;
}
export interface AcceptRequestState {
  serviceRequest?: ServiceRequest;
  mapView?: MapView;
  mapRoute?: Route[];
  viewMap?: boolean;
  routeIds: string[];
  routes?: any[];
  disableSubmit: boolean;
}
export interface GoogleMapState {
  mapView?: MapView;
  googleMap?: any;
  viewMap?: boolean;
}

export interface TransporterProfile {
  id: string;
  address: Address;
  companyName: string;
  fullname: string;
  email: string;
  phone: string;
  scopes: string[];
  paymentAccountId?: string;
  addedOn: number;
  modifiedOn: number;
  documents: Document[];
}

export interface DeliveryState {
  status: RequestStatus;
  serviceRequests: ServiceRequest[];
  totalCount: number;
  openMenu: boolean;
  loader: boolean;
}

export interface RouteTabState {
  serviceRequest: any;
  transportRoute: Route;
}

export interface CompleteDeliveryRequestState {
  serviceRequest: ServiceRequest;
  requestId: string;
  identificationCode: string;
  identificationCodeValid: boolean;
  disableSubmit: boolean;
  isWaiting: boolean;
  googleMap: object;
  routeId: string;
}

export interface CompleteCRMRequestState {
  serviceRequest: ServiceRequest;
  requestId: string;
  isWaiting: boolean;
  ableToReach: string;
  isOptOutOfCMR: boolean;
  isReviewCompleted: boolean;
  openMenu: boolean;
  inCompleteReviewReason: string;
}

export interface CompleteRequest {
  routeId?: string;
  startTime?: string;
  endTime?: string;
  waitingTime?: {
    hours: number;
    minutes: number;
  };
  completeCmrRequest?: CompleteCmrRequest;
}

export interface CompleteCmrRequest {
  ableToReach?: boolean;
  inCompleteReviewReason?: string;
  isReviewCompleted?: boolean;
  isOptOutOfCMR?: boolean;
}
export interface AuthChallenge {
  challengeName: string;
  session: string;
}
