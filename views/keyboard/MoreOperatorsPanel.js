'use strict';
var _ = require('underscore');
var React = require('react-native');
var {
  PropTypes,
  Text,
  TouchableHighlight,
  View,
} = React;

var styles = require('../../styles/keyboard');
var Keys = require('./Keys');

var {
  Key,
  MultiKey,
} = Keys;

var nav = 'nav',
    prefixOp = 'prefixOp',
    infixOp = 'infixOp',
    postfixOp = 'postfixOp';

var MoreOperatorsPanel = React.createClass({
  render: function () {
    var controls = this.props.controls;
    return (
      <View style={styles.keyboardPanel}>
        <View style={styles.row}>
          <MultiKey controls={controls}>
            <Key label={'('} tokenType={'parensOpen'} />
            <Key label={')'} tokenType={'parensClose'} />
          </MultiKey>
          <Key label={'⃖'} tokenType={nav} controls={controls} style={[styles.keyCap, styles.navKeyCap]} textStyle={[styles.keyText, styles.navKeyText]}/>
          <Key label={'⃗'} tokenType={nav} controls={controls} style={[styles.keyCap, styles.navKeyCap]} textStyle={[styles.keyText, styles.navKeyText]}/>
          <Key label={'⌫'} tokenType={nav} literal={'delete'} controls={controls} style={[styles.keyCap, styles.navKeyCap]} textStyle={[styles.keyText, styles.navKeyText]}/>
        </View>
        <View style={styles.row}>
          <MultiKey controls={controls}>
            <Key label={'sin'} literal={'sin('} tokenType={prefixOp} />
            <Key label={'asin'} literal={'asin('} tokenType={prefixOp} />
            <Key label={'sinh'} literal={'sinh('} tokenType={prefixOp} />
            <Key label={'asinh'} literal={'asinh('} tokenType={prefixOp} />
          </MultiKey>
          <MultiKey controls={controls}>
            <Key label={'cos'} literal={'cos('} tokenType={prefixOp} />
            <Key label={'acos'} literal={'acos('} tokenType={prefixOp} />
            <Key label={'cosh'} literal={'cosh('} tokenType={prefixOp} />
            <Key label={'acosh'} literal={'acosh('} tokenType={prefixOp} />
          </MultiKey>
          <MultiKey controls={controls}>
            <Key label={'tan'} literal={'tan('} tokenType={prefixOp} />
            <Key label={'atan'} literal={'atan('} tokenType={prefixOp} />
            <Key label={'tanh'} literal={'tanh('} tokenType={prefixOp} />
            <Key label={'atanh'} literal={'atanh('} tokenType={prefixOp} />
          </MultiKey>
        </View>
        {this.props.children}
      </View>
    );
  },
});

module.exports = MoreOperatorsPanel;