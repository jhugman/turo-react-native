const test = require('tap').test, _ = require('underscore');

const turo = require('turo'), EditableDocument = turo.EditableDocument, storage = new turo.storage.LocalFiles();

const Actions = require('../lib/editor-actions');

EditableDocument.storage = storage;



test('Mixed demo', t => {

  const doc = EditableDocument.create('test1');
  const actions = new Actions(doc);
  const textLines = [
    '1 + 2',
    'unparsable',
    '3 + ',
    '2 + ',
    '4',
  ];
  doc.evaluateDocument(textLines.join('\n'));

  const docLines = actions.docToLines();

  t.equal(docLines.length, textLines.length);

  // Lines with statements attached
  // this is expected to handle multi line statements
  // and lines of text that are unparseable.
  let results = _.filter(docLines, l => l.statement);
  t.equal(results.length, 3); // includes the unparsable.

  results = _.filter(docLines, l => {
    const s = l.statement;
    return s && s.isParseable();
  });
  t.equal(results.length, 2); // does not include unparsable.

  t.end();
});

const doc = EditableDocument.create('test1');
let actions = new Actions(doc);

function testValueLines (t, lines, expectedValues) {
  doc.evaluateDocument(lines.join('\n'));
  const docLines = actions.docToLines();
  const observedLines = _.map(docLines, l => l.text);

  t.deepEqual(lines, observedLines);

  t.deepEqual(expectedValues, linesToString(docLines));
}

function linesToString (docLines) {
  return _.map(docLines, l => {
    const s = l.statement;
    return s && s.isParseable() ? s.valueToString() : null;
  });
}

test('Editor friendly objects', t => {
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

test('Replace line', t => {
  testValueLines(t, [
    '1',
    '2',
    '3'
  ], 
  ['1', '2', '3']);
  actions = new Actions(doc, { line: 1 });
  
  console.log('Pre replace');
  console.log(_.map(actions.docToLines(), l => l.text))

  actions.replaceLine('4');

  console.log('Post replace');
  console.log(_.map(actions.docToLines(), l => l.text));
  const observed = linesToString(actions.docToLines());
  //t.deepEqual(observed, ['4', '2', '3']);
  t.end();
});

test('Tabcomplete', t => {
  testValueLines(t, [
    'r',
    '2',
    'radius = 3'
  ], 
  [null, '2', '3']);
  actions = new Actions(doc);

  actions.editToken = 1;
  const c = actions.tabCompletion;
  t.equal(c.prefix, 'r');
  t.deepEqual(c.completions, ['radius', ' =']);

  t.end();
});