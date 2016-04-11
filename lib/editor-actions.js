const _ = require('underscore'), turo = require('turo'), EditorActions = turo.EditorActions;

require('./editor-actions-events');
require('./editor-actions-keyboard');

function TuroLine (id, lineIndex, text, statement) {
  this.id = id;
  this.statement = statement;
  this.text = text;
  this.lineIndex = lineIndex;
  this.lineNum = lineIndex + 1;
}

Object.defineProperties(TuroLine.prototype, {
  // none yet 
});

EditorActions.extend({
  replaceLine(string, callback) {
    console.log('replaceLine');
    const lines = this.findLines();

    const _line = this.editToken.line;
    const localLineNum = _line - this.lineFirst;

    console.log(`this.line - this.lineFirst = ${_line} - ${this.lineFirst}`);
    lines[localLineNum] = string;

    console.log('\tedit token: ', this._editToken);
    console.log(`\tevaluating ${lines.join(' ')}`);
    this.doc.evaluateStatement(this.id, lines.join('\n'), callback);
  },

  replaceDocument(string, callback) {
    this.doc.evaluateDocument(string, callback);
  },

  newEditToken(line) {
    this._editToken = {
      line: line || 0,
    };
  },



  moveCursorTo(newLineNum) {
    let editToken;
    const info = this.statement.info;
    if (info.lineFirst <= newLineNum &&
        newLineNum <= info.lineLast) {
      editToken = this.editToken;
      editToken.line = line;
    } else {
      editToken = {
        line,
      };
      this.editToken = editToken;
    }

    return editToken;
  },

  findLines() {
    const s = this.statement;
    return s.text.split('\n');
  },

  docToLines() {
    const text = this.doc.text, statements = this.doc.statements;

    const textLines = text.split('\n');

    let lineIndex = 0, statementIndex = 0;

    let s = statements[statementIndex], startIndex = lineIndex, endIndex = s.info.lineLast - 1, id = s.id;



    const turoLines = [];
    let offsetLast = 0;

    while (lineIndex < textLines.length) {
      let value = null;
      if (lineIndex === endIndex) {
        value = s;

        s.info.lineFirst = startIndex - 1;
        s.info.lineLast = endIndex - 1;

        //console.log('statement at ' + lineIndex + '; statement[' + statementIndex + '] = (' + startIndex + ', ' + endIndex + ')');

        statementIndex ++;
        s = statements[statementIndex];
        if (s) {
          startIndex = lineIndex + 1;
          endIndex = startIndex + (s.info.lineLast - s.info.lineFirst);
          id = s.id;
        } else {
          id = null;
          startIndex = -1;
          endIndex = -1;
        }
      }

      const line = new TuroLine(id, lineIndex, textLines[lineIndex], value);
      line.offsetFirst = offsetLast;
      offsetLast += line.text.length;
      line.offsetLast = offsetLast;
      turoLines.push(line);
      lineIndex ++;
    }
    if (turoLines.length !== textLines.length) {
      throw new Error(`Assert ${turoLines.length} === ${textLines.length}`);
    }
    return turoLines;
  },
});

EditorActions.addEditStateProperties({
  lines() {
    return this.docToLines();
  },
  lineFirst() {
    return this.statement.info.lineFirst;
  },
  lineLast() {
    return this.statement.info.lineLast;
  },
});



module.exports = EditorActions;
