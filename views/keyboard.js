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

var HomeKeyboardPanel = require('./keyboard/HomePanel'),
    MoreOperatorsPanel = require('./keyboard/MoreOperatorsPanel');

var styles = require('../styles/keyboard');

var Keyboard = React.createClass({
  componentDidMount: function () {
    var actions = this.props.actions;
    actions.on('SelectionDidChange', this.onCursorChanged);
  },

  componentWillUnmount: function () {
    var actions = this.props.actions;
    actions.unon('SelectionDidChange', this.onCursorChanged);
  },

  onCursorChanged: function (ev) {
    var actions = this.props.actions;
    this.setState({now: Date.now()});
  },

  render: function () {
    var actions = this.props.actions;
    var enablement = actions.keyboardEnablement;
    var controls = {
      onKeyPress: function (key) {
        if (key.tokenType === 'nav') {
          switch (key.literal) {
            case 'delete':
              actions.emit('DeletePressed', 1);
              break;
            case 'left':
              break;
            case 'right':
              break;
            case 'unitKeyboard':
              break;
          }
          return;
        } else if (key.tokenType === 'unit' && key.literal === '__unitKeyboard') {

        }
        actions.emit('KeyPressed', key);
      },

      isEnabled: function (key) {
        if (key.tokenType === 'nav') {
          return true;
        }
        if (enablement) {
          return enablement[key.tokenType];
        }
        return false;
      },
    };
    return (
      <View style={styles.keyboard}>
          <HomeKeyboardPanel
            style={styles.keyboardPanel}
            controls={controls} />
      </View>
    );
        //<ScrollView
          // pagingEnabled={true}
          // showsHorizontalScrollIndicator={true}
          // bounces={true}
          // horizontal={true}>
          // <MoreOperatorsPanel
          //   style={styles.keyboardPanel}
          //   controls={controls} />
        //</ScrollView>
  }

});

module.exports = {
  Keyboard: Keyboard,
  KeyboardSpace: require('./keyboard/KeyboardSpace'),
}
