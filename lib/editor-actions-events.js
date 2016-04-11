const _ = require('underscore'), events = require('events'), turo = require('turo'), EditorActions = turo.EditorActions;

Object.defineProperties(EditorActions.prototype, {
  emitter: {
    get() {
      if (!this._emitter) {
        this._emitter = new events.EventEmitter();
      }
      return this._emitter;
    },
  },
});

EditorActions.extend({
  on() {
    const emitter = this.emitter;
    emitter.addListener.apply(emitter, arguments);
  },

  unon() {
    const emitter = this.emitter;
    emitter.removeListener.apply(emitter, arguments);
  },

  emit() {
    const emitter = this.emitter;
    emitter.emit.apply(emitter, arguments);
  },
});

