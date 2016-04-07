'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

var BOARD_PADDING = 8;
var CELL_MARGIN = 4;
var CELL_SIZE = 44;
var FONT_SIZE = 18;
var MARGIN=8;
var colors = require('./colors');
module.exports = StyleSheet.create({
  container: {
    padding: 0,
    marginTop: 0,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: colors.KeyboardShiftKeyBackground,
  },
  scrollView: {
    margin: 0,
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.EditorAccessoryNavigationBackground,
    borderRightWidth: 0.5,
    borderColor: '#fff',
    padding: BOARD_PADDING,
    height: CELL_SIZE,
    justifyContent: 'center',
    margin: 0,
  },
  buttonText: {
    color: '#fff',
    fontFamily: '.HelveticaNeueInterface-M3',
    fontSize: FONT_SIZE,
    textAlign: 'center',
  },
  completion: {
    alignItems: 'center',
    backgroundColor: colors.EditorAccessoryCompletionBackground,
    borderRightWidth: 0.5,
    borderColor: '#fff',
    padding: BOARD_PADDING,
    height: CELL_SIZE,
    justifyContent: 'center',
    margin: 0,
  },
  text: {
    color: '#fff',
    fontFamily: '.HelveticaNeueInterface-M3',
    fontSize: FONT_SIZE,
    textAlign: 'center',
  },
  
});
