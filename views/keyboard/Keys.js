'use strict';
var _ = require('underscore');
var React = require('react-native');
var {
  Children,
  Image,
  PropTypes,
  Text,
  TouchableHighlight,
  View,
} = React;

var styles = require('../../styles/keyboard');

var MultiKey = React.createClass({
  render: function () {
    var controls = this.props.controls;
    var children = Children.map(this.props.children, (child) => child);
    var started, enabled, actual;
    _.each(children, function (child) {
      var props = child.props;
      if (!started) {
        actual = props;
        started = true;
      }
      if (!enabled && controls.isEnabled(props)) {
        actual = props;
        enabled = true;
      }
    });
    return (
      <Key {...actual} controls={controls}/>
    );
  },
});

var Key = React.createClass({
  propTypes: {
    label: PropTypes.string.isRequired,
    literal: PropTypes.string,
    tokenType: PropTypes.string,

    // TODO this should be required, but needs us to have a subkey/multikey.
    controls: PropTypes.object,
    style: View.propTypes.style,
  },

  render: function () {
    let key = this.props.label + "_" + this.props.tokenType;
    let keyCap, onPress, textStyle
    if (this.props.controls.isEnabled(this.props)) {
      keyCap = this.props.style || styles.keyCap;
      onPress = this._handlePress
      textStyle = this.props.textStyle || styles.keyText;
    } else {
      keyCap = [styles.keyCap, styles.keyCapDisabled]
      textStyle = styles.keyTextDisabled
    }
    return (
      <TouchableHighlight
          activeOpacity={0.2}
          style={keyCap}
          onPress={onPress}
          key={key}
      >
        <Text style={textStyle}>{this.props.label}</Text>
      </TouchableHighlight>
    )
  },

  _handlePress: function (e) {
    this.props.controls.onKeyPress(this.props);
  },
});

module.exports = {
  Key: Key,
  MultiKey: MultiKey,
};
