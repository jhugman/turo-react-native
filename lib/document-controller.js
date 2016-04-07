'use strict';

var _ = require('underscore');

var turo = require('turo'),
    EditableDocument = turo.EditableDocument,
    storage = new turo.storage.LocalFiles();

var Actions = require('../lib/editor-actions');

EditableDocument.storage = storage;

function DocumentController (id) {
  this.id = id;
  this.init();
  this.createDummy();
}

_.extend(DocumentController.prototype, {
  init: function () {
    var doc = EditableDocument.create('current');
    doc.import('app');
  },

  createDummy: function () {
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

  deletePressed: function () {

  },

  enterPressed: function () {

  },

  leftCursor: function () {

  },

  rightCursor: function () {

  },

  keyPressed: function (key) {

  },

  _commitChanges: function () {

  },

  _replaceAllText: function (text) {

  },

});

Object.defineProperties(DocumentController.prototype, {
  line: {
    set: function (line) {
      this._line = line;
    },
    get: function () {
      return this._line;
    },
  }
});