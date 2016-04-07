// TuroEditor.js
'use strict';
var React = require('react-native'),
    _ = require('underscore');
var {
  View,
  PropTypes,
  requireNativeComponent
} = React;

var NativeTextEditor = requireNativeComponent('TuroEditor', TuroEditor);

var _TuroEditor = React.createClass({

  propTypes: {
    editorText: PropTypes.string,
    onChangeText: PropTypes.func,
    onChangeSelection: PropTypes.func,
    onEditSelection: PropTypes.func,
  },

  render: function () {
    return <NativeTextEditor {...this.props} onChangeDocument={this._handleChange}/>;
  },

  _handleChange: function (e) {
    this.props.onChangeText(e.nativeEvent);
  },

});

var TuroEditor = React.createClass({
  propTypes: {
    editorText: PropTypes.string.isRequired,
    
    textStyles: PropTypes.object,
    
    onChangeText: PropTypes.func.isRequired,
    onInit: PropTypes.func,
    onChangeSelection: PropTypes.func,
    onEditSelection: PropTypes.func,

    menuItems: PropTypes.array,
    keyboardVisibility: PropTypes.object,

    style: View.propTypes.style,
  },

  componentWillMount: function () {
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  },

  getInitialState: function() {
    return {
      editorText: '',
    };
  },

  render: function () {
    // Don't do the expensive safeHtml operation more often than
    // needed. This is assume you don't mutate and reuse the same
    // makeSafe config object, please don't do that.
    
    this._editorText = this.props.editorText;
    return (
        <_TuroEditor
          style={[this.props.style]}
          selection={this.props.selection}
          menuItems={this.props.menuItems}
          onInit={this.onInit}
          onChangeText={this.onChangeText}
          onChangeSelection={this.onChangeSelection}
          onEditSelection={this.onEditSelection}
          editorText={this._editorText} 
          textInsert={this.props.textInsert}
          textDelete={this.props.textDelete}
          keyboardVisibility={this.props.keyboardVisibility}/>
    );
  },

  onChangeText: function (e) {
    if (e.nativeEvent) {
      e = e.nativeEvent;
    }
    this.props.onChangeText(e);
  },

  onInit: function (e) {
    if (_.isFunction(this.props.onInit)) {
      this.props.onInit(e.nativeEvent);
    }
  },

  onChangeSelection: function (e) {
    if (_.isFunction(this.props.onChangeSelection)) {
      this.props.onChangeSelection(e.nativeEvent);
    }
  },

  onEditSelection: function (e) {
    if (_.isFunction(this.props.onEditSelection)) {
      this.props.onEditSelection(e.nativeEvent);
    }
  },
});



module.exports = TuroEditor;