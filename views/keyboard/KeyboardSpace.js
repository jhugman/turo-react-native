'use strict';
var React = require('react-native');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var {
  View,
} = React;

var colors = require('../../styles/colors');

class KeyboardSpace extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      keyboardSpace: 0
    };

    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  updateKeyboardSpace(frames) {
    console.log(frames)
    let end = frames.end || frames.endCoordinates
    console.log('About to error:', end)
    this.setState({keyboardSpace: end.height});
  }

  resetKeyboardSpace() {
    this.setState({keyboardSpace: 0});
  }

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  render() {
    console.log('Rendering softkeyboard spacer: ' + this.state.keyboardSpace);
    return (
      <View style={{height: this.state.keyboardSpace, backgroundColor: colors.KeyboardBackground}}></View>
    );
  }
}

module.exports = KeyboardSpace;
