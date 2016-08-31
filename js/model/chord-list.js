const Backbone = require('backbone-nested-models');

const Chord = require('model/chord.js');

module.exports = Backbone.Collection.extend({
    model : Chord
});