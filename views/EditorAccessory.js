'use strict';
var _ = require('underscore');
var React = require('react-native');
var {
  PropTypes,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} = React;

var allButtons = {
  alphanum: [
    {text: 'Done', action: 'dismissKeyboard', },
    {text: '123', action: 'numbersKeyboard', },
  ],
  none: [
    // {text: 'ABC', action: 'qwertyKeyboard', },
    {text: '123', action: 'numbersKeyboard', },
  ],
  numbers: [
    {text: 'Done', action: 'dismissKeyboard', },
    {text: 'ABC', action: 'qwertyKeyboard', },
  ],
};

var styles = require('../styles/editor-accessory');

var EditorAccessory = React.createClass({
  PropTypes: {
    onSuggestionPressed: PropTypes.func.required,
  },

  getInitialState: function () {
    return {
      completions: [],
      prefix: '',
      keyboardType: 'none',
    };
  }, 

  componentDidMount: function () {
    var actions = this.props.actions;
    if (!actions) {
      return;
    }
    actions.on('KeyboardWillShow', this._handleKeyboardChange);
    actions.on('SelectionDidChange', this._handleCursorChange);
  },

  componentWillUnmount: function () {
    var actions = this.props.actions;
    if (!actions) {
      return;
    }
    actions.unon('KeyboardWillShow', this._handleKeyboardChange);
    actions.unon('SelectionDidChange', this._handleCursorChange);
  },

  renderButton: function (b) {
      return (
        <TouchableHighlight
            key={b.text}
            activeOpacity={0.2}
            style={styles.button} 
            onPress={() => this._handleStaticButton(b)} >
          <Text style={styles.buttonText}>{b.text}</Text>
        </TouchableHighlight>
      );
  },

  renderSuggestion: function(completion) {
      return (
        <TouchableHighlight
            key={completion}
            activeOpacity={0.2}
            style={styles.completion} 
            onPress={() => this._handlePress(completion)} >
          <Text style={styles.text}>{completion}</Text>
        </TouchableHighlight>
      );
  },

  render: function () {
    var actions = this.props.actions;

    var {
      completions, 
      prefix,
      keyboardType,
    } = this.state;

    if (completions.length > 10) {
      completions.length = 10;
    }

    let buttons = allButtons[keyboardType].map(this.renderButton, this)
    let suggestions = completions.map(this.renderSuggestion, this)
    if (completions.length > 0) {
      return (
        <View style={styles.container}>
            {buttons}
            <ScrollView horizontal={true} style={styles.scrollView}>
              {suggestions}
            </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          {buttons}
        </View>
      )
    }
  },

  _handleCursorChange: function () {
    var actions = this.props.actions;
    this.setState(actions.tabCompletion);
  },

  _handleStaticButton: function (b) {
    var actions = this.props.actions;
    switch (b.action) {
      case 'dismissKeyboard':
        actions.emit('KeyboardWillShow', 'none');
        break;
      case 'numbersKeyboard':
        actions.emit('KeyboardWillShow', 'numbers');
        break;
      case 'qwertyKeyboard':
        actions.emit('KeyboardWillShow', 'alphanum');
        break;
      default:
        // NOP
    }
  },

  _handleKeyboardChange: function (keyboardType) {
    this.setState({keyboardType});
  },

  _handlePress: function (text) {
    var actions = this.props.actions;
    var prefix = this.state.prefix;
    if (prefix && text.indexOf(prefix) === 0) {
      text = text.substring(prefix.length);
    }
    // if the prefix == text, then we need 
    // to move the text forward somehow.
    if (!text) {
      text = ' ';
    } else if (!prefix) {
      text = ' ' + text + ' ';
    }
    actions.insertText({ literal: text });
    return true;
  },
});

module.exports = EditorAccessory;