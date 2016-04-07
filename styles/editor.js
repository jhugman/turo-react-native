'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

var MARGIN=8,
    PADDING_TOP = -1,
    PADDING_HORIZONTAL = 5;

module.exports = StyleSheet.create({
  editorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 100,
  },
  textEditor: {
    flex: 60,
    // fontSize: 20,
    borderColor: 'gray',
    borderTopWidth: 0.5,
    marginBottom: MARGIN,
    marginTop: MARGIN - PADDING_TOP,
    paddingRight: MARGIN,
    // textAlign: 'left',
  },
  listView: {
    borderColor: 'gray',
    marginBottom: MARGIN,
    marginTop: MARGIN,
    paddingTop: 0,
    backgroundColor: '#eee',
  },
  resultListView: {
    flex: 30,
    marginRight: MARGIN,
    backgroundColor: 'white',
    borderLeftWidth: 0.5,
  },
  lineNumberListView: {
    flex: 10,
    borderRightWidth: 0.5,
  },

  itemContainer: {
    
  },

  resultContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#aaa',
    justifyContent: 'center',
  },

  lineNumContainer: {
    justifyContent: 'center',
  },

  lineNum: {
    textAlign: 'right',
    color: '#aaa',
    marginRight: MARGIN,
  },
  result: {
    textAlign: 'left',
    marginLeft: MARGIN,
    //backgroundColor: 'red',
    color: 'black',
  },
});
