const Backbone = require('backbone');
const Tone = require('tone');

const Chord = require('model/chord.js');

/**
 * @module ChordList
 * @class
 *
 * A `ChordList` is a `Collection`of {@link Chord}s. `Chord`s are sorted by their start
 * time.
 *
 * @extends Backbone.Collection
 */
module.exports = Backbone.Collection.extend({
    model : Chord,
    /**
     * @method comparator
     *
     * @desc Compares two `Chord`s and returns `-1` if the first chord has a lower start
     * time, `1` if the right chord has a lower start time, and `0` if start times
     * are identical. Keeps the collection sorted by start time.
     */
    comparator : function(left, right) {
        const leftTime = Tone.Time(left.get('start')).toTicks();
        const rightTime = Tone.Time(right.get('start')).toTicks();
        return Math.sign(leftTime - rightTime);
    }
});