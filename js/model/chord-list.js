const Backbone = require('backbone');
const Tone = require('tone');

const Chord = require('model/chord.js');

/**
 * @module ChordList
 * @class
 *
 * A `ChordList` is a `Collection`of `Chord`s. `Chord`s are sorted by their start
 * time.
 *
 * @extends Backbone.Collection
 */
module.exports = Backbone.Collection.extend({
    model : Chord,
    comparator : function(left, right) {
        const leftTime = Tone.Time(left.get('start')).toTicks();
        const rightTime = Tone.Time(right.get('start')).toTicks();
        return Math.sign(leftTime - rightTime);
    }
});