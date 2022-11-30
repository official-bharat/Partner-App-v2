export interface BaseEntity {
  id?: string;
  createdOn?: number;
  lastModifiedOn?: number;
}

export interface Address {
  fullAddress: string;
  city?: string;
  locality?: string;
  subLocality?: string;
  state?: string;
  zip?: string;
  landmark?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface Patient extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  patientHeight?: {
    feet: number,
    inch: number,
  };
  patientWeight?: string;
}

export interface Route extends BaseEntity {
  routeId?: string;
  pickupAddress: Address;
  dropoffAddress: Address;
  pickupTime: number;
  expectedArrivalTime: number;
  totalMiles: number;
  duration: number;
  particulars?: string[];
  googleMap?: any;
  driverId?: string;
  driverName?: string;
  status: RouteStatus;
  transporterId?: string;
  estimatedPayout?: number;
}

export interface ServiceRequest extends BaseEntity {
  cmrRequest: any;
  additionalNotes: string;
  appointment: {
    date: Date;
    timestamp: any;
    timezone: string;
    patient: Patient;
    totalMinutes?: number;
    meeting?: Meeting;
    facility: {
      address: Address;
      name: string;
    };
  };
  interpreterRequest?: InterpretationRequest;
  transportRequest?: TransportRequest;
  deliveryRequest?: DeliveryRequest;
  payment: {
    estimatedPayout: number;
  };
  status: RequestStatus;
  requestId: string;
  assignment: Assignment;
}

export interface CMRRequest extends BaseEntity {
  additionalNotes: string;
  appointment: {
    date: Date;
    timestamp: any;
    timezone: string;
    patient: Patient;
    totalMinutes?: number;
    meeting?: Meeting;
    facility: {
      address: Address;
      name: string;
    };
  };
  interpreterRequest?: InterpretationRequest;
  transportRequest?: TransportRequest;
  deliveryRequest?: DeliveryRequest;
  payment: {
    estimatedPayout: number;
  };
  status: RequestStatus;
  requestId: string;
  assignment: Assignment;
  cmrRequest: any;
}

export interface DeliveryRequest {
  routes: Route[];
  businessCloseTime: string;
  deliveryItems: string[];
  mapRoutes: Route[];
}

export interface Assignment {
  transporters?: Array<{transporterId: string; routeId: string}>;
}

export interface Meeting {
  joinLink: string;
}

export interface TransportRequest {
  visitType: 'Procedure' | 'Non-Procedure';
  conciergeService: boolean;
  vehicleType: 'Sedan' | 'Wheelchair' | 'Stretcher';
  routes: Route[];
  transport: string;
  totalDistance: number;
  estimatedVisitTime: {
    hours: number;
    minutes?: number;
  };
  mapRoutes: Route[];
}

export interface InterpretationRequest {
  estimatedTime: {
    hours: number;
    minutes: number;
  };
  isMedicalInterpretation: boolean;
  language: string;
  serviceType: 'Phone' | 'In-Person' | 'Video';
  isImmediateInterpretation: boolean;
}
export interface CancellationReason {
  reason: string;
  comments?: string;
  canceledBy: string;
}

export interface Transporter extends BaseEntity {
  userId: string;
}

export interface Interpreter extends BaseEntity {
  userId: string;
  languages: InterpreterLanguage[];
  address: Address;
  paymentAccountId?: string;
  birthDate: number;
  ssn: string;
}

export interface InterpreterLanguage {
  languageId?: string;
  languageName: string;
  certificates: [
    {
      certificateId: string;
      expirationTime?: number;
      status?: 'VERIFIED' | 'PENDING' | 'EXPIRED';
      auditedBy?: string;
      auditedOn?: number;
    },
  ];
}

export interface Payout extends BaseEntity {
  amount: number;
  paymentMethod: 'Manual' | 'Automatic';
  status: PayoutStatus;
  vendorId: string; // Interpreter/Transporter ID
  requestId: string; // Service Request ID
  remarks?: string; // Remarks if any
}
export interface InterpreterProfile {
  id: string;
  address: Address;
  languages: InterpreterLanguage[];
  fullname: string;
  email: string;
  phone: string;
  paymentAccountId?: string;
  addedOn?: number;
  modifiedOn?: number;
  birthDate?: number;
  ssn?: string;
}

export interface DriverProfile {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  scopes: Array<Scope>;
  address: Address;
  licenceNo: string;
  licenceState: string;
  expireYear: string;
  isCertified: boolean;
  addedOn: number;
  modifiedOn: number;
  status: UserStatus;
  transporterId: string;
  documents: Document[];
}

export interface coordinates {
  latitude: number;
  longitude: number;
}

export type Scope = 'transporter' | 'interpreter' | 'driver';

export type UserStatus =
  | 'SETUP_PENDING'
  | 'ACTIVE'
  | 'BLOCKED'
  | 'DEACTIVATED'
  | 'PENDING_VERIFICATION';

export type MemberType = 'ORG_ADMIN' | 'ORG_USER' | 'INDIVIDUAL';

export type RequestStatus =
  | 'Pending'
  | 'Assigned'
  | 'Confirmed'
  | 'Completed'
  | 'Canceled';

export type PayoutStatus = 'Paid' | 'Pending' | 'Rejected';
export type RouteStatus = 'Pending' | 'Accepted' | 'Completed';
