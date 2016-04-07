'use strict';

var test = require('tap').test,
    _ = require('underscore');

var turo = require('turo'),
    EditableDocument = turo.EditableDocument,
    storage = new turo.storage.LocalFiles();

var Actions = require('../lib/editor-actions');

EditableDocument.storage = storage;



test('Mixed demo', function (t) {

  var doc = EditableDocument.create('test1');
  var actions = new Actions(doc);
  var textLines = [
    '1 + 2',
    'unparsable',
    '3 + ',
    '2 + ',
    '4',
  ];
  doc.evaluateDocument(textLines.join('\n'));

  var docLines = actions.docToLines();

  t.equal(docLines.length, textLines.length);

  // Lines with statements attached
  // this is expected to handle multi line statements
  // and lines of text that are unparseable.
  var results = _.filter(docLines, function (l) {
    return l.statement;
  });
  t.equal(results.length, 3); // includes the unparsable.

  results = _.filter(docLines, function (l) {
    var s = l.statement;
    return s && s.isParseable();
  });
  t.equal(results.length, 2); // does not include unparsable.

  t.end();
});

var doc = EditableDocument.create('test1');
var actions = new Actions(doc);

function testValueLines (t, lines, expectedValues) {
  doc.evaluateDocument(lines.join('\n'));
  var docLines = actions.docToLines();
  var observedLines = _.map(docLines, function (l) {
    return l.text;
  });

  t.deepEqual(lines, observedLines);

  t.deepEqual(expectedValues, linesToString(docLines));
}

function linesToString (docLines) {
  return _.map(docLines, function (l) {
    var s = l.statement;
    return s && s.isParseable() ? s.valueToString() : null;
  });
}

test('Editor friendly objects', function (t) {
  testValueLines(t, [
    '1',
    '2',
    '3'
  ], 
  ['1', '2', '3']);

  testValueLines(t, 
  [
    '1 + 2',
    '3 - 4',
    '5 * 6'
  ], 
  [
    '3',
    '-1',
    '30'
  ]);

  testValueLines(t, 
  [
    '1 + 2',
    'unparsable',
    '3 - 4',
  ], 
  [
    '3',
    null,
    '-1',
  ]);

  testValueLines(t, 
  [
    '1 + 2',
    'unparsable',
    '3 - 4 *',
    '5',
  ], 
  [
    '3',
    null,
    null,
    '-17',
  ]);

  testValueLines(t, 
  [
    '1 + 2',
    '3 - 4 *',
    '5',
    'unparsable',
  ], 
  [
    '3',
    null,
    '-17',
    null,
  ]);

  t.end();
});

test('Replace line', function (t) {
  testValueLines(t, [
    '1',
    '2',
    '3'
  ], 
  ['1', '2', '3']);
  actions = new Actions(doc, { line: 1 });
  
  console.log('Pre replace');
  console.log(_.map(actions.docToLines(), function (l) {
    return l.text;
  }))

  actions.replaceLine('4');

  console.log('Post replace');
  console.log(_.map(actions.docToLines(), function (l) {
    return l.text;
  }));
  var observed = linesToString(actions.docToLines());
  //t.deepEqual(observed, ['4', '2', '3']);
  t.end();
});

test('Tabcomplete', function (t) {
  testValueLines(t, [
    'r',
    '2',
    'radius = 3'
  ], 
  [null, '2', '3']);
  actions = new Actions(doc);

  actions.editToken = 1;
  var c = actions.tabCompletion;
  t.equal(c.prefix, 'r');
  t.deepEqual(c.completions, ['radius', ' =']);

  t.end();
});