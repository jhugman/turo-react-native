'use strict';

var _ = require('underscore'),
    events = require('events'),
    turo = require('turo'),
    EditorActions = turo.EditorActions;

Object.defineProperties(EditorActions.prototype, {
  emitter: {
    get: function () {
      if (!this._emitter) {
        this._emitter = new events.EventEmitter();
      }
      return this._emitter;
    },
  },
});

EditorActions.extend({
  on: function () {
    var emitter = this.emitter;
    emitter.addListener.apply(emitter, arguments);
  },

  unon: function () {
    var emitter = this.emitter;
    emitter.removeListener.apply(emitter, arguments);
  },

  emit: function () {
    var emitter = this.emitter;
    emitter.emit.apply(emitter, arguments);
  },
});

