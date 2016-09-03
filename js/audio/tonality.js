const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const Tone = require('tone');

const Tonality = {
    tone : Tone,
    keys : ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
    modes : ['Major', 'Minor', 'Harmonic', 'Melodic', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']
}

_.extend(Tonality, Backbone.Events);

module.exports = Tonality;