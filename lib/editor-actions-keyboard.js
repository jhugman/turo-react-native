const _ = require('underscore'), events = require('events'), turo = require('turo'), EditorActions = turo.EditorActions;

Object.defineProperties(EditorActions.prototype, {
  keyboardPredictor: {
    get() {
      if (!this._keyboardPredictor) {
        this._keyboardPredictor = this.createTokenPredictor({
          digits: true,
          point: true,
          exponent: true,
          plusMinus: true,
          multiplyDivide: true,
          parensOpen: true,
          parensClose: true,

          variable() {
            return self.variables;
          },
          unit() {
            return self.units.unitSchemes;
          },
          unitPer: true,
          unitPower: true,
          unitIn: true,
          infixOp() {
            return self.operators;
          },
          postfixOp() {
            return self.operators;
          },
          prefixOp() {
            return self.operators;
          }
        });
      }

      return this._keyboardPredictor;
    },
  },

  tabCompletionPredictor: {
    get() {
      if (this._tabCompletionPredictor) {
        return this._tabCompletionPredictor;
      }

      this._tabCompletionPredictor = this.createTokenPredictor({
        variable(scope) {          
          return scope.getAvailableVariables();
        },
        unit(scope) {
          return scope.getAvailableUnits();
        },
        plusMinus() {
          return ['+', '-'];
        },
        multiplyDivide() {
          return ['*', '/'];
        },
        assignment() {
          return ['='];
        },
        number() {
          console.log('Looking for number');
        },
        operator: _.bind(turo.operators.getInfixOperatorNames, turo.operators),
        "variable definition"() {
          // NOP
        },
        startNumber() {
          return true;
        }
      });
      return this._tabCompletionPredictor;
    },
  },
});

EditorActions.extend({
  insertText(text) {
    this.emit('KeyPressed', text);
  },

  pressDelete(times) {
    this.emit('DeletePressed', times);
  },

});

EditorActions.addEditStateProperties({
  keyboardEnablement() {
    const s = this.statement;
    if (!s) {
      return;
    }
    return this.keyboardPredictor.createKeyboard(
      s.text, 
      this.editToken.offset - s.info.offsetFirst
    );
  },

  tabCompletion() {
    const s = this.statement;
    if (!s) {
      return;
    }
    const completionData = this.tabCompletionPredictor.tabComplete(
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