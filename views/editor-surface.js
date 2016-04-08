'use strict';

var _ = require('underscore');

var TuroEditor = require('./TuroEditor'),
    ScrollLockView = require('./ScrollLockView');

var prefs = {
      precisionType: 'sf',
      precisionDigits: 5,
      shortUnitNames: true,
    };

var styles = require('../styles/editor');

var React = require('react-native');
var {
  ListView,
  PropTypes,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var EditorSurface = React.createClass({

  propTypes: {
    style: View.propTypes.style,
  },

  getInitialState: function() {
    var doc = this.props.doc;
    return {
      resultsDataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return true; // row1.id !== row2.id;  // row1 !== row2;
        },
      }),
      lineNumDataSource: new ListView.DataSource({
        rowHasChanged: function (row1, row2) {
          return true; // row1.id !== row2.id;  // row1 !== row2;
        },
      }),
      loaded: true,
      hasLineInfo: false,
      edits: {},
    };
  },

  componentDidMount: function () {
    var actions = this.props.actions;
    if (actions) {
      actions.on('KeyPressed', this.onKeyPressed);
      actions.on('DeletePressed', this.onDeletePressed);
      actions.on('KeyboardWillShow', this.onKeyboardStateChange);
    }
    this.onChangeSelection = _.debounce(this.onChangeSelection, 10);
  },

  componentWillUnmount: function () {
    var actions = this.props.actions;
    if (actions) {
      actions.unon('KeyPressed', this.onKeyPressed);
      actions.unon('DeletePressed', this.onDeletePressed);
      actions.unon('KeyboardWillShow', this.onKeyboardStateChange);
    }  
  },

  render: function() {
    if (!this.state.hasLineInfo) {
      return (
        <ScrollLockView style={styles.editorContainer}>
          <View style={[styles.listView, styles.lineNumberListView]} />
          <TuroEditor
            editorText={this.props.initialText}
            style={styles.textEditor}
            onChangeText={this.onUpdateText}
            onInit={this._onTextMeasure} />
          <View style={[styles.listView, styles.resultListView]} />
        </ScrollLockView>  
      );
    }

    return (
      <ScrollLockView style={styles.editorContainer}>
        <ListView 
          style={[styles.listView, styles.lineNumberListView]}
          dataSource={this.state.lineNumDataSource}
          initialListSize={20}
          renderRow={this.renderStatementNumber} />
        <TuroEditor
          editorText={this.props.initialText}
          style={styles.textEditor}
          
          textInsert={this.state.textInserted}
          textDelete={this.state.deletePressed}
          menuItems={this.state.menuItems}
          keyboardVisibility={this.state.keyboardVisibility}

          onChangeText={this.onUpdateText}
          onChangeSelection={this.onChangeSelection}
          onEditSelection={this.onEditSelection}/>
        <ListView 
          style={[styles.listView, styles.resultListView]}
          dataSource={this.state.resultsDataSource}
          initialListSize={20}
          renderRow={this.renderStatementResult} />
      </ScrollLockView>
    );
  },

  renderStatementNumber: function (line: object, sectionID: number, rowID: number) {
    var height = {height: line.height},
        lineNum = line.lineIndex + 1;
    if (line.visible) {
      return (
        <View key={lineNum} style={[height, styles.itemContainer, styles.lineNumContainer]}>
          <Text style={styles.lineNum}>{lineNum}</Text>
        </View>
      );
    }
    return (
      <View 
        style={[
          height, 
          styles.itemContainer, 
          styles.lineNumContainer
        ]}/>
    );
  },

  renderStatementResult: function (statement: object, sectionID: number, rowID: number) {
    var height = {height: statement.height};
    if (statement.isParseable()) {
      return (
        <View key={rowID} style={[height, styles.itemContainer, styles.resultContainer]}>
          <Text style={styles.result}>
            {statement.valueToString(undefined, prefs)}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={height}>
          <Text style={styles.result}></Text>
        </View>
      )
    }
  },

  _rerenderDisplay: function (doc, softWrapping) {
    var actions = this.props.actions;
    
    var statements = doc.statements;
    var hardLines = actions.docToLines();
    var softLineIndex = 0,
        hardLineIndex = 0,
        statementIndex = 0,
        text = doc.text,
        startSoftLine,
        statementStartSoftLine,
        statementStartHardLine;

    // TODO iterate over hardlines, from statements
    _.each(softWrapping, function (softLine) {
      var endOfSoftLine = softLine.offsetLast;
      
      startSoftLine = startSoftLine || softLine;
      statementStartSoftLine = statementStartSoftLine || softLine;

      var hardLine = hardLines[hardLineIndex],
          statement = statements[statementIndex];

      if (text[endOfSoftLine] === '\n') {
        hardLine.height = softLine.top - startSoftLine.bottom;
        startSoftLine = undefined;
        if (!statementStartHardLine) {
          hardLine.visible = true;
          statementStartHardLine = hardLine;
        } else {
          hardLine.visible = false;
        }
        hardLineIndex ++;
      }

      if (endOfSoftLine === statement.info.offsetLast) {
        statementIndex ++;
        statement.height = softLine.top - statementStartSoftLine.bottom;
        statementStartSoftLine = undefined;
        statementStartHardLine = undefined;
      }
      
    });

    this.setState({
      resultsDataSource: this.state.resultsDataSource.cloneWithRows(statements),
      lineNumDataSource: this.state.lineNumDataSource.cloneWithRows(hardLines),
      hasLineInfo: !!softWrapping,
    });
  },

  onUpdateText: function (ev, cb) {
    var actions = this.props.actions;
    actions.replaceDocument(ev.text, function (err, doc) {
      this._rerenderDisplay(doc, ev.textWrappingOffsets);
    }.bind(this));
    return true;
  },

  _onTextMeasure: function (ev) {
    ev.text = this.props.initialText;
    this.onUpdateText(ev);
  },

  onChangeSelection: function (ev) {
    var menuItems = (ev.start === ev.end)
      ? ['Zero', 'GROOT']
      : ['Extract', 'Rename'];
    this.setState({
      menuItems: menuItems,
    });

    var actions = this.props.actions;
    actions.editToken = ev.start;
    actions.emit('SelectionDidChange', ev);
  },

  onEditSelection: function (ev) {
    switch (ev.actionLabel) {
      case 'GROOT': 
        this._sendEdit('insert', { text: 'I AM GROOT' });
        break;
      case 'Zero':
        this._sendEdit('insert', { text: '000' });
        break;
      default:
        console.log('editor-surface.onEditSelection(\'' + ev.actionLabel + '\', ' + JSON.stringify(ev) + ')');
    }
  },

  onKeyPressed: function (key) {
    if (key.tokenType != 'nav') {
      this._sendEdit('textInserted', {text: key.literal || key.label});
    }
  },

  onDeletePressed: function (times) {
    this._sendEdit('deletePressed', {deleteLength: times});
  },

  _sendEdit: function (type, body) {
    body.__t = Date.now();
    var edits = {};
    edits[type] = body;
    this.setState(edits);
  },

  onKeyboardStateChange: function (newKeyboard) {
    console.log('newKeyboard: ' + newKeyboard);
    var visible, focus;
    switch (newKeyboard) {
      case 'alphanum':
        visible = true;
        focus = true;
        break;
      case 'none':
        visible = true;
        focus = false;
        break;
      default:
        visible = false;
        focus = true;
    }
    this._sendEdit('keyboardVisibility', {visible, focus});
  },
});

module.exports = EditorSurface;