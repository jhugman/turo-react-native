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
    literal: PropTypes.string.isRequired,
    tokenType: PropTypes.string,

    controls: PropTypes.object.isRequired,
    style: View.propTypes.style,
  },

  render: function () {
    if (this.props.controls.isEnabled(this.props)) {
      var keyCap = this.props.style || styles.keyCap;
      var textStyle = this.props.textStyle || styles.keyText;
      return (
        <TouchableHighlight
            activeOpacity={0.2}
            style={keyCap} 
            onPress={this._handlePress}
        >
          <Text style={textStyle}>{this.props.label}</Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <View style={[styles.keyCap, styles.keyCapDisabled]}>
          <Text style={styles.keyTextDisabled}>{this.props.label}</Text>
        </View>
      );
    }
  },

  _handlePress: function (e) {
    this.props.controls.onKeyPress(this.props);
  },
});

module.exports = {
  Key: Key,
  MultiKey: MultiKey,
};