'use strict';

var _ = require('underscore'),
    events = require('events'),
    turo = require('turo'),
    EditorActions = turo.EditorActions;

Object.defineProperties(EditorActions.prototype, {
  keyboardPredictor: {
    get: function () {
      if (!this._keyboardPredictor) {
        this._keyboardPredictor = this.createTokenPredictor({
          digits: true,
          point: true,
          exponent: true,
          plusMinus: true,
          multiplyDivide: true,
          parensOpen: true,
          parensClose: true,

          variable: function () {
            return self.variables;
          },
          unit: function () {
            return self.units.unitSchemes;
          },
          unitPer: true,
          unitPower: true,
          unitIn: true,
          infixOp: function () {
            return self.operators;
          },
          postfixOp: function () {
            return self.operators;
          },
          prefixOp: function () {
            return self.operators;
          }
        });
      }

      return this._keyboardPredictor;
    },
  },

  tabCompletionPredictor: {
    get: function () {
      if (this._tabCompletionPredictor) {
        return this._tabCompletionPredictor;
      }

      this._tabCompletionPredictor = this.createTokenPredictor({
        variable: function (scope) {          
          return scope.getAvailableVariables();
        },
        unit: function (scope) {
          return scope.getAvailableUnits();
        },
        plusMinus: function () {
          return ['+', '-'];
        },
        multiplyDivide: function () {
          return ['*', '/'];
        },
        assignment: function () {
          return ['='];
        },
        number: function () {
          console.log('Looking for number');
        },
        operator: _.bind(turo.operators.getInfixOperatorNames, turo.operators),
        "variable definition": function () {
          // NOP
        },
        startNumber: function () {
          return true;
        }
      });
      return this._tabCompletionPredictor;
    },
  },
});

EditorActions.extend({
  insertText: function (text) {
    this.emit('KeyPressed', text);
  },

  pressDelete: function (times) {
    this.emit('DeletePressed', times);
  },

});

EditorActions.addEditStateProperties({
  keyboardEnablement: function () {
    var s = this.statement;
    if (!s) {
      return;
    }
    return this.keyboardPredictor.createKeyboard(
      s.text, 
      this.editToken.offset - s.info.offsetFirst
    );
  },

  tabCompletion: function () {
    var s = this.statement;
    if (!s) {
      return;
    }
    var completionData = this.tabCompletionPredictor.tabComplete(
      s.text,
      s.text,
      this.editToken.offset - s.info.offsetFirst
    );
    console.log('editor-action-keyboard.tabCompletion');

    return {
      prefix: completionData[1],
      completions: completionData[0],
    };
  },
});