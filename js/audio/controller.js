const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

const Tonality = require('audio/tonality.js');
var step = 0;

function AudioController(song) {
    _.extend(this, Backbone.Events);

    this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

    const self = this;
    this.part = new Tone.Part(function(time, event) {
        // var note = Tonality.sub('C5', step);
        // console.log('C3 + ' + step + ' = ' + note);
        // step++;
        self.synth.triggerAttackRelease('C3', '16n', time);
    });
    this.part.start('0m');
    this.part.stop('8m');
    // part.loopStart = '0m';
    // part.loopEnd = '8m';
    // part.loop = true;

    Tone.Transport.loopStart = "0m";
    Tone.Transport.loopEnd = "8m";
    Tone.Transport.loop = true;

    this.song = song;

    const sequence = song.get('sequence');
    this.listenTo(sequence, 'change:tempo', this.updateTempo);
    this.listenTo(sequence, 'change:loopLength', this.updateLoopLength);

    const chordList = sequence.get('chordList');
    this.listenTo(chordList, 'update', this.updateChordList);
    this.listenTo(chordList, 'change', this.updateChord);

    return this;
}

AudioController.prototype.updateTempo = function(sequence) {
    Tone.Transport.bpm.value = sequence.get('tempo');
}


AudioController.prototype.updateLoopLength = function(sequence) {
    Tone.Transport.loopEnd = sequence.get('loopLength');
}

AudioController.prototype.updateChordList = function(chordList, options) {
    _.each(options.changes.added, function(chord) {
        // const chordData = chord.toJSON();
        this.part.add(chord.get('start'), 'C3');
    }, this);

    _.each(options.changes.removed, function(chord) {
        // const chordData = chord.toJSON();
        this.part.remove(chord.get('start'), chord);
    }, this);
}

AudioController.prototype.updateChord = function(chord) {
    if (chord.hasChanged('start')) {
        this.part.remove(chord.previous('start'), chord);
        this.part.add(chord.get('start'), chord);
    }
}

module.exports = AudioController;