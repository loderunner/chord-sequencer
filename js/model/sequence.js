const Backbone = require('backbone-nested-models');

const ChordList = require('model/chord-list.js');

/**
 * @module Sequence
 * @class
 *
 * A `Sequence` encapsulates a complete song. It contains global attributes, like song key or tempo. It also contains
 * a `Collection` of {@link Chord} events.
 *
 * @property {string}       key         - The (tonal) key of the song. Defaults to `'C'`.
 * @property {string}       mode        - The mode of the scale. Defaults to `'Major'`.
 * @property {number}       tempo       - The tempo of the song in BPM. Defaults to 120.
 * @property {string}       loopLength  - The length of the current loop in Tone.js musical time notation. Defaults to `'1m'`.
 * @property {ChordList}    chordList   - The actual list of {@link Chord} events in the sequence.
 *
 * @extends Backbone.Model
 */
module.exports = Backbone.Model.extend({
    relations : {
        'chordList' : ChordList
    },
    defaults : {
        key : 'C',
        mode : 'Major',
        tempo : 120,
        loopLength : '1m',
        chordList : function() { return new ChordList; }
    }
});