const Backbone = require('backbone-nested-models');

const Sequence = require('model/sequence.js');


/**
 * @module Song
 * @class
 * 
 * This describes an entire project.
 *
 * @property {string}   key         - The (tonal) key of the song. Defaults to `'C'`.
 * @property {string}   mode        - The mode of the scale. Defaults to `'Major'`.
 * @property {number}   tempo       - The tempo of the song in BPM. Defaults to 120.
 * @property {string}   loopLength  - The length of the current loop in Tone.js musical time notation. Defaults to `'1m'`.
 *
 * @extends Backbone.Model
 */
module.exports = Backbone.Model.extend({
    relations : {
        'sequence' : Sequence
    },
    defaults : {
        key : 'C',
        mode : 'Major',
        tempo : 120,
        loopLength : '1m',
        sequence : function() { return new Sequence; }
    }
});