/**
 * @format
 */
import React from 'react';
import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs();
function HeadlessCheck() {
  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
