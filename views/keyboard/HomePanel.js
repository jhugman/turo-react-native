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

var digits = 'digits',
    nav = 'nav',
    multOp = 'multiplyDivide',
    addOp = 'plusMinus',
    prefixOp = 'prefixOp',
    infixOp = 'infixOp',
    postfixOp = 'postfixOp';

var HomeKeyboardPanel = React.createClass({
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
          <Key label={'7'} tokenType={digits} controls={controls}/>
          <Key label={'8'} tokenType={digits} controls={controls}/>
          <Key label={'9'} tokenType={digits} controls={controls}/>
          <Key label={'÷'} literal={'/'} tokenType={multOp} controls={controls}/>
          <Key label={'in'} tokenType={'unitIn'} controls={controls}/>
        </View>
        <View style={styles.row}>
          <Key label={'4'} tokenType={digits} controls={controls}/>
          <Key label={'5'} tokenType={digits} controls={controls}/>
          <Key label={'6'} tokenType={digits} controls={controls}/>
          <Key label={'×'} literal={'×'} tokenType={multOp} controls={controls}/>
          <Key label={'√'} tokenType={prefixOp} controls={controls}/>
        </View>
        <View style={styles.row}>
          <Key label={'1'} tokenType={digits} controls={controls}/>
          <Key label={'2'} tokenType={digits} controls={controls}/>
          <Key label={'3'} tokenType={digits} controls={controls}/>
          <Key label={'-'} tokenType={addOp} controls={controls}/>
          <Key label={'^'} tokenType={infixOp} controls={controls}/>
        </View>
        <View style={styles.row}>
          <Key label={'0'} tokenType={digits} controls={controls}/>
          <Key label={'.'} tokenType={'point'} controls={controls}/>
          <MultiKey controls={controls}>
            <Key label={'e'} tokenType={'exponent'} />
            <Key label={'e'} tokenType={'variable'} />
          </MultiKey>
          <Key label={'+'} tokenType={addOp} controls={controls}/>
          <Key label={'1/x'} literal={'1/'} tokenType={postfixOp} controls={controls}/>
        </View>
        {this.props.children}
      </View>
    );
  },
});

module.exports = HomeKeyboardPanel;
