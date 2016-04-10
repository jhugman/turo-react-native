/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';


var React = require('react-native');
var {
  AppRegistry,
} = React;


var TuroApp = require('./views/DocumentEditorScreen'),
    EditorAccessory = require('./views/EditorAccessory');

AppRegistry.registerComponent('Turo', () => TuroApp);
AppRegistry.registerComponent('EditorAccessory', () => EditorAccessory);
AppRegistry.registerComponent('TuroKeyboard', () => EditorAccessory);
