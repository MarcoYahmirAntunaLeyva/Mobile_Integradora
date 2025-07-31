if (typeof atob === 'undefined') {
  global.atob = (data) => Buffer.from(data, 'base64').toString('binary');
}
if (typeof btoa === 'undefined') {
  global.btoa = (data) => Buffer.from(data, 'binary').toString('base64');
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
