const Backbone = require('backbone-nested-models');

/**
 * @module Chord
 * @class
 *
 * A `Chord` encapsulates a complete song.
 *
 * @property {string}       step        - The degree (or step) of the root note of the chord in the scale. Defaults to 1.
 * @property {boolean}      seventh     - `true` if the chord contains a seventh note. Defaults to `false`.
 * @property {string}       start       - The start time of the chord in the sequence, in Tone.js time notation. Defaults to `'0m'`.
 * @property {string}       duration    - The duration of the chord, in Tone.js time notation. Defaults to `'16n'`.
 *
 * @extends Backbone.Model
 */
module.exports = Backbone.Model.extend({
    defaults : {

    }
});