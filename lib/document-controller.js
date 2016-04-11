const _ = require('underscore');

const turo = require('turo'), EditableDocument = turo.EditableDocument, storage = new turo.storage.LocalFiles();

const Actions = require('../lib/editor-actions');

EditableDocument.storage = storage;

function DocumentController (id) {
  this.id = id;
  this.init();
  this.createDummy();
}

_.extend(DocumentController.prototype, {
  init() {
    const doc = EditableDocument.create('current');
    doc.import('app');
  },

  createDummy() {
    doc.evaluateDocument([
      '1 cm + 2 * 3m',
      'r = 2 m',
      'An unparsed expression',
      '1 * ',
      '2 + 3 * 2',
      '2 * pi * r',
      'A very long bit of text that may go on for several lines'
    ].join('\n'));    
  },

  deletePressed() {

  },

  enterPressed() {

  },

  leftCursor() {

  },

  rightCursor() {

  },

  keyPressed(key) {

  },

  _commitChanges() {

  },

  _replaceAllText(text) {

  },

});

Object.defineProperties(DocumentController.prototype, {
  line: {
    set(line) {
      this._line = line;
    },
    get() {
      return this._line;
    },
  }
});