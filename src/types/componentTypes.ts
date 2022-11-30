export interface DrawerInput {
  userInfo: {
    fullname: string;
  };
  logoutHandler: () => void;
  navigators: {
    name: string;
    component: React.ComponentType;
    icon: string;
    title: string;
  }[];
  version: string;
}

export interface AppInput {
  isUserLoggedIn: boolean;
}

export interface BottomNavigationInput {
  navigators: {
    name: string;
    component: React.ComponentType;
    icon: {name: string; size: number};
    title: string;
  }[];
}
