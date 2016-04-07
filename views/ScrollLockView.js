'use strict';
var React = require('react-native'),
    _ = require('underscore');
var {
  View,
  PropTypes,
  requireNativeComponent
} = React;

var ScrollLockView = React.createClass({

  propTypes: {
  },

  render: function () {
    return (
      <NativeScrollLockView {...this.props} />
    );
  },
});

var NativeScrollLockView = requireNativeComponent('TuroScrollLockView', ScrollLockView);

module.exports = ScrollLockView;