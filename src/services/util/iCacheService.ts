import { SessionInfo } from "../../types/types";

/**
 * @author <Aniket.P>
 * @description Cache service interface
 * @copyright Supra International, inc
 */
export interface ICacheService {
     saveValue(key: string, value: any): Promise<void>;

     getValue(key: string): Promise<string>;

     setSessionInfo(token: string): Promise<void>;

     getSessionInfo(): Promise<SessionInfo>;

     clearCache(): Promise<void>;
}
