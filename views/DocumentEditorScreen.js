'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

var turo = require('turo'),
    EditableDocument = turo.EditableDocument,
    storage = new turo.storage.LocalFiles();

var Actions = require('../lib/editor-actions'),
    prefs = {
      precisionType: 'sf',
      precisionDigits: 5,
      shortUnitNames: true,
    };
    
EditableDocument.storage = storage;
function createActions (doc, id, line, column) {
  var editToken = {
    id: id,
    line: line,
    column: column,
  };
  return new Actions(doc, editToken);
}


var globalStyles = require('../styles/global'),
    styles = require('../styles/document-editor-screen'),
    EditorSurface = require('./editor-surface'),
    EditorAccessory = require('./EditorAccessory'),
    keyboard = require('./keyboard'),
    Keyboard = keyboard.Keyboard,
    SoftKeyboardSpace = keyboard.KeyboardSpace;

var EditorScreen = React.createClass({

  getInitialState: function () {
    return {
      doc: null,
    };
  },

  componentDidMount: function() {
    this.fetchData('frontpage');
    var actions = this.state.actions;
    if (!actions) {
      return;
    }
  },

  componentWillUnmount: function () {
    var actions = this.state.actions;
    if (!actions) {
      return;
    }
    actions.unon('KeyboardWillShow', this._handleKeyboardChange);
  },

  fetchData: function(documentName) {
    var callback = function (err, doc) {
      var actions = createActions(doc);

      actions.on('KeyboardWillShow', this._handleKeyboardChange);

      this.setState({
        doc: doc,
        actions: actions,
        loaded: true,
        keyboardType: 'none',
      });
    }.bind(this);

    if (documentName) {
      EditableDocument.load(
        documentName,
        ['app'],
        callback
      );
    } else {
      var doc = EditableDocument.create();
      doc.import(['app'], callback);
    }
  },

  render: function() {
    if (!this.state.loaded) {
      return this._renderLoading();
    }

    // TODO passing state.doc into EditorSurface shouldn't happen.
    // editor-surface should just contain actions
    var doc = this.state.doc,
        actions = this.state.actions;
        // register interest on events,
        // call into edit the document.

    return (
      <View style={styles.container}>
        <EditorSurface style={styles.textEditor}
          initialText={doc.text}
          doc={this.state.doc}
          actions={actions} />
        <EditorAccessory style={styles.editorAccessory} actions={actions} />
        {this._renderKeyboardArea(actions)}
      </View>
    );
    // <Keyboard styles={styles.keyboard} actions={actions} />
  },

  _renderKeyboardArea: function (actions) {
    console.log('_renderKeyboardArea: ' + this.state.keyboardType);
    switch (this.state.keyboardType) {
      case 'none':
      case 'alphanum':
        return (
          <SoftKeyboardSpace />
        );
      case 'numbers':
        return (
          <Keyboard styles={styles.keyboard} actions={actions} />
        );
    }
    return (
      <View/>
    );
    
  },

  _renderLoading: function () {
    return (
      <View style={styles.container}>
        
      </View>
    );
  },

  _handleKeyboardChange: function (newKeyboard) {
    console.log('_handleKeyboardChange: ' + newKeyboard);
    this.setState({
      keyboardType: newKeyboard,
    });
  },
});

module.exports = EditorScreen;