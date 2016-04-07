'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1, 
    //backgroundColor: '#aabbcc',
    paddingTop: 22,
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  textEditor: {
    // backgroundColor: '#887766',
  },

  editorAccessory: {
    backgroundColor: '#887766',
  },

  keyboard: {
    alignSelf: 'flex-end',
  }  

});
