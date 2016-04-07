'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

var BOARD_PADDING = 3;
var CELL_MARGIN = 4;
var CELL_SIZE = 44;
var FONT_SIZE = 24;
var MARGIN=8;

var colors = require('./colors');

module.exports = StyleSheet.create({
  keyboard: {
    backgroundColor: colors.KeyboardBackground,
    padding: BOARD_PADDING + MARGIN,
    marginTop: 0,
  },
  keyboardPanel: {
    flex: 1,
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
  },
  keyCap: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: colors.KeyboardKeyShadow,
    borderBottomWidth: 2,
    borderColor: '#878a8e',
    borderRadius: 10,
    borderWidth: 0.001,
    flex: 1,
    height: CELL_SIZE,
    justifyContent: 'center',
    margin: CELL_MARGIN,
    width: CELL_SIZE,
  },
  keyText: {
    color: '#000000',
    //fontFamily: '.HelveticaNeueInterface-MediumP4',
    fontSize: FONT_SIZE,
    textAlign: 'center',
  },
  

  keyCapDisabled: {
    backgroundColor: colors.KeyboardBackground,
  
    margin: CELL_MARGIN,
  },
  keyTextDisabled: {
    color: '#444',
    //fontFamily: '.HelveticaNeueInterface-MediumP4',
    fontSize: FONT_SIZE,
    textAlign: 'center',
  },
  

  navKeyCap: {
    backgroundColor: colors.KeyboardShiftKeyBackground,
  },
  navKeyText: {
    color: '#ffffff',
  },
});
