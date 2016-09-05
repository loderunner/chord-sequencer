const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'sequencer-container',

    // Lifecycle
    initialize : function() {
        const chordList = this.model.get('chordList');
        this.listenTo(this.model, "change:loopLength", this.updateLoopLength);
        this.listenTo(chordList, "add", this.addChord);
        this.listenTo(chordList, "remove", this.removeChord);
        this.listenTo(chordList, "change", this.updateChord);
        this.create();
    },

    create : function() {
        const html = require('html!view/html/sequencer.html');
        this.$el.append(html);
    },

    // Model events
    updateLoopLength : function(sequence) {
    },

    updateChordList : function(sequence) {
    },

    addChord : function(chord, chordList) {
        console.log(chordList, chord);
    },

    removeChord : function(chord, chordList) {
        console.log(chordList, chord);
    },

    updateChord : function(chord, chordList) {
        console.log(chordList, chord);
    }
});