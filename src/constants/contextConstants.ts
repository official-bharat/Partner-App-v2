import React from 'react';
import {SessionInfo} from '../types/types';

export class Context {
  public static readonly GlobalContext =
    React.createContext<GlobalContextInput>({} as any);
}

export interface GlobalContextInput {
  showLoader: (value: boolean) => void;
  checkUserIsLoggedIn: () => void;
  sessionInfo?: SessionInfo;
}
