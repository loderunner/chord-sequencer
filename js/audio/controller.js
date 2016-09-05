const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

function AudioController(song) {
    _.extend(this, Backbone.Events);

    this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

    const self = this;
    this.part = new Tone.Part(function(time, event) {
        self.synth.triggerAttackRelease('C3', '8n', time);
    }, ['0m', '4n', '2 * 4n', '3 * 4n']);
    this.part.start('0m');
    this.part.stop('8m');
    // part.loopStart = '0m';
    // part.loopEnd = '8m';
    // part.loop = true;

    Tone.Transport.loopStart = "0m";
    Tone.Transport.loopEnd = "8m";
    Tone.Transport.loop = true;

    this.song = song;

    this.listenTo(song.get('sequence'), 'change:tempo', this.updateTempo);
    this.listenTo(song.get('sequence'), 'change:loopLength', this.updateLoopLength);

    return this;
}

AudioController.prototype.updateTempo = function(sequence) {
    Tone.Transport.bpm.value = sequence.get('tempo');
}


AudioController.prototype.updateLoopLength = function(sequence) {
    Tone.Transport.loopEnd = sequence.get('loopLength');
}

module.exports = AudioController;