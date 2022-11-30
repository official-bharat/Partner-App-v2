import {DriverProfile, InterpreterProfile, Payout} from '../../types/entity';
import {
  ChangePasswordRequest,
  GetPayoutRequest,
  RespondToAuthChallengeRequest,
} from '../../types/requests';
import {
  AuthChallenge,
  LoginRequest,
  TransporterProfile,
} from '../../types/types';
import {ApiResponse} from '../util/iHttpService';

export interface IUserService {
  login(
    loginRequest: LoginRequest,
  ): Promise<ApiResponse<string | AuthChallenge>>;

  respondToAuthChallenge(
    respondToAuthChallenge: RespondToAuthChallengeRequest,
  ): Promise<ApiResponse<string>>;

  getInterpreterProfile(): Promise<ApiResponse<InterpreterProfile>>;
  getDriverProfile(): Promise<ApiResponse<DriverProfile>>;

  displayCertificate(fileName: string): Promise<ApiResponse<any>>;

  changePassword(
    passwordChangeRequest: ChangePasswordRequest,
  ): Promise<ApiResponse<any>>;

  getPayoutList(
    getPayoutRequest: GetPayoutRequest,
  ): Promise<ApiResponse<Payout[]>>;

  getDriverList(start?: number): Promise<ApiResponse<DriverProfile[]>>;

  getTransporterProfile(): Promise<ApiResponse<TransporterProfile>>;
}
